import { Fragment, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Snackbar,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListProductsForAdminQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} from "@/services/api/product";
import {
  Add,
  Delete,
  Edit,
  Refresh,
  Restore,
  Search,
} from "@mui/icons-material";
import ProductFormControl from "./shared/ProductFormControl";
import { useListCategoriesForAdminQuery } from "@/services/api/categories";
import ErrorDisplay from "@/components/ErrorDisplay";

const ProductsManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
  });
  const [variants, setVariants] = useState([
    {
      price: "",
      quantity: "",
      colorId: "",
      sizeId: "",
      imageId: "",
    },
  ]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    data: dataProducts,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    refetch: refetchProducts,
  } = useListProductsForAdminQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [restoreProduct] = useRestoreProductMutation();

  const { data: dataCategories } = useListCategoriesForAdminQuery({
    refetchOnMountOrArgChange: true,
  });

  const dataRowProducts = dataProducts?.result?.items || [];
  const totalRows = dataProducts?.result?.totalItems || 0;

  const columnsProduct = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên sản phẩm", width: 400 },
    { field: "description", headerName: "Mô tả", width: 500 },
    {
      field: "isAvailable",
      headerName: "Có sẵn",
      width: 150,
    },
    {
      field: "averageRating",
      headerName: "Đánh giá trung bình",
      width: 150,
    },
    {
      field: "soldQuantity",
      headerName: "Số lượng đã bán",
      width: 150,
    },
    {
      field: "totalReviews",
      headerName: "Tổng đánh giá",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 150,
    },

    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <Fragment>
          <IconButton onClick={() => handleEditProduct(params.row.id)}>
            <Edit color="primary" />
          </IconButton>
          {params.row.status === "INACTIVE" ? (
            <IconButton onClick={() => handleOpenRestoreDialog(params.row.id)}>
              <Restore color="success" />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleOpenDeleteDialog(params.row.id)}>
              <Delete color="error" />
            </IconButton>
          )}
        </Fragment>
      ),
    },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedProductId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedProductId(null);
    setOpenDeleteDialog(false);
  };

  const handleOpenRestoreDialog = (id) => {
    setSelectedProductId(id);
    setOpenRestoreDialog(true);
  };

  const handleCloseRestoreDialog = () => {
    setSelectedProductId(null);
    setOpenRestoreDialog(false);
  };

  const handleRefresh = () => {
    refetchProducts();
    setSnackbar({
      open: true,
      message: "Danh sách sản phẩm đã được làm mới!",
      severity: "info",
    });
  };

  const handleAddProduct = async () => {
    setSubmitted(true);

    try {
      await addProduct({
        ...newProduct,
        variants,
      }).unwrap();
      setSnackbar({
        open: true,
        message: "Thêm sản phẩm thành công!",
        severity: "success",
      });
      setNewProduct({
        name: "",
        description: "",
        categoryId: "",
      });
      setVariants([
        {
          price: "",
          quantity: "",
          colorId: "",
          sizeId: "",
          imageId: "",
        },
      ]);
      setOpenAddDialog(false);
      setSubmitted(false);
      refetchProducts();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  const extractImageIdFromUrl = (url) => {
    if (!url) return "";
    const parts = url.split("/");
    const fileWithExt = parts[parts.length - 1]; // ví dụ: bgzg2dcswpbfv2eomapk.png
    const fileName = fileWithExt.split(".")[0]; // bỏ .png
    return fileName; // hoặc bạn có cách mapping imageUrl → imageId
  };

  const handleEditProduct = (id) => {
    const productToEdit = dataRowProducts.find((item) => item.id === id);
    console.log("Product to edit:", productToEdit);

    if (productToEdit) {
      setNewProduct({
        name: productToEdit.name,
        description: productToEdit.description,
        categoryId: productToEdit.categoryId,
      });
      setVariants(
        productToEdit.variants.map((variant) => ({
          price: variant.price,
          quantity: variant.quantity,
          colorId: variant.colorId,
          sizeId: variant.sizeId,
          imageId: extractImageIdFromUrl(variant.imageUrl) || "",
        })) || []
      );
      setSelectedProductId(id);
      setOpenEditDialog(true);
    }
  };

  const handleUpdateProduct = async () => {
    setSubmitted(true);

    try {
      await updateProduct({
        id: selectedProductId,
        ...newProduct,
        variants,
      });
      setSnackbar({
        open: true,
        message: "Cập nhật sản phẩm thành công!",
        severity: "success",
      });
      setNewProduct({ name: "", description: "", categoryId: "" });
      setVariants([
        {
          price: "",
          quantity: "",
          colorId: "",
          sizeId: "",
          imageId: "",
        },
      ]);
      setSelectedProductId(null);
      setOpenEditDialog(false);
      setSubmitted(false);
      refetchProducts();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct({ id: selectedProductId }).unwrap();
      setSnackbar({
        open: true,
        message: "Xóa sản phẩm thành công!",
        severity: "success",
      });
      setOpenDeleteDialog(false);
      setSelectedProductId(null);
      refetchProducts();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  const handleRestoreProduct = async () => {
    try {
      await restoreProduct({ id: selectedProductId }).unwrap();
      setSnackbar({
        open: true,
        message: "Khôi phục sản phẩm thành công!",
        severity: "success",
      });
      setOpenRestoreDialog(false);
      setSelectedProductId(null);
      refetchProducts();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  if (isErrorProducts)
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách sản phẩm. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Sản phẩm
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ mb: 4 }}
        display={"flex"}
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
      >
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 5 }}>
          <TextField
            fullWidth
            variant="standard"
            label="Tìm kiếm sản phẩm"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton aria-label="search">
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
              }}
              label="Trạng thái"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box
        sx={{ mb: 2, xs: 12, sm: 12 }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
          Làm mới
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenAddDialog(true);
            setNewProduct({
              name: "",
              description: "",
              categoryId: "",
            });
          }}
          startIcon={<Add />}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      <Box height={500} width={"100%"}>
        <DataGrid
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          rows={dataRowProducts}
          columns={columnsProduct}
          rowCount={totalRows}
          disableSelectionOnClick
          loading={isLoadingProducts}
          slotProps={{
            loadingOverlay: {
              variant: "linear-progress",
              noRowsVariant: "linear-progress",
            },
          }}
          localeText={{
            noRowsLabel: "Hiện tại không có sản phẩm nào",
          }}
          pagination
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 15, 20]}
        />
      </Box>

      {/* TODO: Dialog add product */}
      <Dialog fullWidth open={openAddDialog}>
        <DialogTitle>Thêm sản phẩm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên sản phẩm"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
            error={submitted && !newProduct.name}
            helperText={
              submitted && !newProduct.name ? "name không được để trống" : ""
            }
          />
          <TextField
            multiline
            label="Mô tả"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
            error={submitted && !newProduct.description}
            helperText={
              submitted && !newProduct.description
                ? "description không được để trống"
                : ""
            }
          />
          <FormControl fullWidth sx={{ mt: 2 }} required>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={newProduct.categoryId || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, categoryId: e.target.value })
              }
              label="Danh mục"
              // error={!!formErrors.categoryId}
            >
              {dataCategories?.result?.items?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ProductFormControl variants={variants} setVariants={setVariants} />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenAddDialog(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleAddProduct}
            variant="contained"
            color="primary"
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* TODO: Dialog edit product */}
      <Dialog fullWidth open={openEditDialog}>
        <DialogTitle>Cập nhật sản phẩm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên sản phẩm"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
            error={submitted && !newProduct.name}
            helperText={
              submitted && !newProduct.name ? "name không được để trống" : ""
            }
          />
          <TextField
            multiline
            placeholder="Mô tả sản phâm"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
            error={submitted && !newProduct.description}
            helperText={
              submitted && !newProduct.description
                ? "description không được để trống"
                : ""
            }
          />
          <FormControl fullWidth sx={{ mt: 2 }} required>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={newProduct.categoryId || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, categoryId: e.target.value })
              }
              label="Danh mục"
              // error={!!formErrors.categoryId}
            >
              {dataCategories?.result?.items?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ProductFormControl variants={variants} setVariants={setVariants} />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenEditDialog(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleUpdateProduct}
            variant="contained"
            color="primary"
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog}>
        <DialogTitle>Xác nhận xóa ?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa sản phẩm này không ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseDeleteDialog}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProduct}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRestoreDialog}>
        <DialogTitle>Xác nhận khôi phục ?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn khôi phục sản phẩm này không ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseRestoreDialog}>
            Huỷ
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleRestoreProduct}
          >
            Khôi phục
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "right", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayoutWrapper>
  );
};

export default ProductsManagement;
