import { useState } from "react";
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
  Box,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import SnackbarComponent from "@/components/Snackbar";
import {
  useListAllProduct_VariantsByProductQuery,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useRestoreProductVariantMutation,
} from "@/services/api/productVariant";
import { skipToken } from "@reduxjs/toolkit/query";
import { useListProductsForAdminQuery } from "@/services/api/product";
import { Delete, Edit, Restore } from "@mui/icons-material";
import TableData from "@/components/TableData";

const ProductVariantsManagement = () => {
  const [previewImage, setPreviewImage] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [editProductVariant, setEditProductVariant] = useState(null);

  const [productVariantToDelete, setProductVariantToDelete] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newProductVariant, setNewProductVariant] = useState({
    price: "",
    quantity: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    data: dataProducts,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
    refetch: refetchProducts
  } = useListProductsForAdminQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  console.log(dataProducts);

  const {
    data: dataProductVariants,
    isLoading: isLoadingProductVariant,
    isError: isErrorProductVariant,
    refetch: refetchProductVariants,
  } = useListAllProduct_VariantsByProductQuery(
    selectedProductId
      ? {
          id: selectedProductId,
          page: paginationModel.page,
          size: paginationModel.pageSize,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const [updateProductVariant] = useUpdateProductVariantMutation();
  const [deleteProductVariant] = useDeleteProductVariantMutation();
  const [restoreProductVariant] = useRestoreProductVariantMutation();

  const columnsProductVariant = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "price", headerName: "Giá", width: 150 },
    { field: "quantity", headerName: "Số lượng", width: 150 },
    { field: "isAvailable", headerName: "Có sẵn", width: 150 },
    {
      field: "imageUrl",
      headerName: "Trạng thái",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.row.imageUrl}
          alt={params.row.fileName}
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => setPreviewImage(params.value)}
        />
      ),
    },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "size",
      headerName: "Kích thước",
      width: 120,
      renderCell: (params) => params.row?.size?.name || "-",
    },
    {
      field: "color",
      headerName: "Màu sắc",
      width: 120,
      renderCell: (params) => params.row?.color?.name || "-",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            variant="text"
            color="primary"
            onClick={() => handleEditVariant(params.row)}
          >
            <Edit />
          </IconButton>
          {params.row?.status === "INACTIVE" ? (
            <IconButton
              onClick={() => handleRestoreVariant(params.row.id)}
              color="success"
            >
              <Restore />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleOpenDeleteDialog(params.row.id)}
              color="error"
            >
              <Delete />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const handleEditVariant = (variant) => {
    setEditProductVariant(variant);
    setNewProductVariant({
      price: variant.price?.toString() || "",
      quantity: variant.quantity?.toString() || "",
    });
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (id) => {
    setProductVariantToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteVariant = async () => {
    try {
      await deleteProductVariant(productVariantToDelete).unwrap();
      setOpenDeleteDialog(false);
      setProductVariantToDelete(null);
      setSnackbar({
        open: true,
        message: "Xóa sản phẩm thành công!",
        severity: "success",
      });
      refetchProductVariants();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi xóa sản phẩm";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleRestoreVariant = async (id) => {
    try {
      await restoreProductVariant(id).unwrap();
      setSnackbar({
        open: true,
        message: "Khôi phục sản phẩm thành công!",
        severity: "success",
      });
      refetchProductVariants();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi khôi phục sản phẩm";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditProductVariant(null);
    setNewProductVariant({
      price: "",
      quantity: "",
    });
  };

  const validateVariantData = (variant) => {
    const errors = [];
    if (!variant.price || isNaN(parseFloat(variant.price)))
      errors.push("Giá không hợp lệ");
    if (!variant.quantity || isNaN(parseInt(variant.quantity)))
      errors.push("Số lượng không hợp lệ");
    return errors;
  };

  const handleUpdateVariant = async () => {
    const errors = validateVariantData(newProductVariant);
    if (errors.length > 0) {
      setSnackbar({
        open: true,
        message: errors.join(". "),
        severity: "error",
      });
      return;
    }

    try {
      await updateProductVariant({
        id: editProductVariant.id,
        price: parseFloat(newProductVariant.price),
        quantity: parseInt(newProductVariant.quantity),
      }).unwrap();
      setSnackbar({
        open: true,
        message: "Cập nhật biến thể thành công!",
        severity: "success",
      });
      handleCloseDialog();
      refetchProductVariants();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi cập nhật biến thể";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    refetchProducts();
    setSnackbar({
      open: true,
      message: "Danh sách biến thể sản phẩm đã được làm mới!",
      severity: "info",
    });
  };

  // Lọc sản phẩm trạng thái theo ACTIVE
  const activeProducts = dataProducts?.result?.items.filter(
    (product) => product.status === "ACTIVE"
  );

  const dataRowProductVariants = dataProductVariants?.result?.items || [];
  const totalRows = dataProductVariants?.result?.totalItems || 0;

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Biến thể Sản phẩm
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={9}>
          <Button variant="outlined" onClick={handleRefresh}>
            <RefreshIcon sx={{ mr: 1 }} />
            Làm mới
          </Button>
        </Grid>
      </Grid>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Chọn sản phẩm</InputLabel>
        <Select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          label="Chọn sản phẩm"
        >
          <MenuItem value="">-- Chọn sản phẩm --</MenuItem>
          {activeProducts?.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableData
        rows={dataRowProductVariants}
        totalRows={totalRows}
        columnsData={columnsProductVariant}
        loading={isLoadingProduct || isLoadingProductVariant}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 15, 20]}
        P
      />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Sửa biến thể</DialogTitle>
        <DialogContent>
          <TextField
            label="Giá"
            type="number"
            value={newProductVariant.price}
            onChange={(e) =>
              setNewProductVariant({
                ...newProductVariant,
                price: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="Số lượng"
            type="number"
            value={newProductVariant.quantity}
            onChange={(e) =>
              setNewProductVariant({
                ...newProductVariant,
                quantity: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleUpdateVariant}
            variant="contained"
            color="primary"
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa sản phẩm này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenDeleteDialog(false)}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteVariant}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        aria-hidden="false"
        open={previewImage}
        onClose={() => setPreviewImage(null)}
        fullWidth
      >
        <DialogTitle>Xem ảnh</DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={previewImage}
            alt="Preview"
            sx={{ width: "100%", objectFit: "contain", borderRadius: 2 }}
          />
        </DialogContent>
      </Dialog>

      <SnackbarComponent snackbar={snackbar} onClose={handleCloseSnackbar} />
    </DashboardLayoutWrapper>
  );
};

export default ProductVariantsManagement;
