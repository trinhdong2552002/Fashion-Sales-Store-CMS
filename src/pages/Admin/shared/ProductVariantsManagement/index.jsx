import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListProductsForAdminQuery } from "@/services/api/product"; // Thay đổi import
import {
  useListProductVariantsQuery,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useRestoreProductVariantMutation,
} from "@/services/api/productVariant";
import { useGetMyInfoQuery } from "@/services/api/auth";
import {
  setProductVariants,
  setLoading as setProductVariantLoading,
  setError as setProductVariantError,
  selectProductVariants,
} from "@/store/redux/productVariant/reducer";

const ProductVariantsManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productVariants = useSelector(selectProductVariants);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [editProductVariant, setEditProductVariant] = useState(null);
  const [newProductVariant, setNewProductVariant] = useState({
    price: "",
    quantity: "",
  });
  const [productVariantToDelete, setProductVariantToDelete] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    data: userInfo,
    error: userError,
    isLoading: userLoading,
  } = useGetMyInfoQuery();
  const {
    data: productsData,
    isLoading: isFetchingProducts,
    error: fetchProductsError,
  } = useListProductsForAdminQuery();
  const {
    data: productVariantsData,
    isLoading: isFetchingProductVariants,
    error: fetchProductVariantsError,
    refetch: refetchProductVariants,
  } = useListProductVariantsQuery(
    selectedProductId
      ? { productId: selectedProductId, pageNo: page + 1, pageSize }
      : { skip: true }
  );

  const [updateProductVariant] = useUpdateProductVariantMutation();
  const [deleteProductVariant] = useDeleteProductVariantMutation();
  const [restoreProductVariant] = useRestoreProductVariantMutation();

  useEffect(() => {
    dispatch(setProductVariantLoading(isFetchingProductVariants));
    if (productVariantsData?.items) {
      dispatch(setProductVariants(productVariantsData.items));
      dispatch(setProductVariantError(null));
    }
  }, [productVariantsData, isFetchingProductVariants, dispatch]);

  useEffect(() => {
    if (fetchProductsError) {
      setSnackbar({
        open: true,
        message:
          "Lỗi khi tải danh sách sản phẩm: " +
          (fetchProductsError?.data?.message || "Không xác định"),
        severity: "error",
      });
    }
  }, [fetchProductsError]);

  // Check user permissions
  useEffect(() => {
    if (userError) {
      setSnackbar({
        open: true,
        message:
          "Bạn cần đăng nhập để truy cập trang này: " +
          (userError?.data?.message || "Lỗi không xác định"),
        severity: "error",
      });
      setTimeout(() => navigate("/"), 2000);
    } else if (userInfo) {
      const roles = userInfo.result?.roles || [];
      const hasAdminRole = roles.some(
        (role) => role.name?.toUpperCase() === "ADMIN"
      );
      if (!hasAdminRole) {
        setSnackbar({
          open: true,
          message: `Bạn không có quyền truy cập trang này. Vai trò: ${
            roles.map((r) => r.name).join(", ") || "Không xác định"
          }`,
          severity: "error",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    }
  }, [userInfo, userError, userLoading, navigate]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "price", headerName: "Giá", width: 120 },
    { field: "quantity", headerName: "Số lượng", width: 120 },
    { field: "isAvailable", headerName: "Có sẵn", width: 120 },
    { field: "status", headerName: "Trạng thái", width: 120 },
    {
      field: "product",
      headerName: "Sản phẩm",
      width: 150,
      renderCell: (params) => params.row.product?.name || "N/A",
    },
    {
      field: "size",
      headerName: "Kích thước",
      width: 120,
      renderCell: (params) => params.row.size?.name || "N/A",
    },
    {
      field: "color",
      headerName: "Màu",
      width: 120,
      renderCell: (params) => params.row.color?.name || "N/A",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="text"
            color="primary"
            onClick={() => handleEditVariant(params.row)}
          >
            Sửa
          </Button>
          {params.row?.status === "INACTIVE" ? (
            <Button
              onClick={() => handleRestoreVariant(params.row.id)}
              color="success"
            >
              Khôi phục
            </Button>
          ) : (
            <Button
              onClick={() => handleOpenDeleteDialog(params.row.id)}
              color="error"
            >
              Xóa
            </Button>
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
    setPage(0); // Reset to first page on refresh
    refetchProductVariants();
    setSnackbar({
      open: true,
      message: "Danh sách sản phẩm biến thể đã được làm mới!",
      severity: "info",
    });
  };

  if (userLoading || isFetchingProducts) {
    return <CircularProgress />;
  }

  const totalRows = productVariantsData?.totalItems || 0;

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
          {productsData?.items?.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!selectedProductId ? (
        <Alert severity="info">
          Vui lòng chọn một sản phẩm để xem biến thể.
        </Alert>
      ) : fetchProductVariantsError ? (
        <Alert severity="error">
          {fetchProductVariantsError?.data?.message || "Lỗi khi tải biến thể"}
        </Alert>
      ) : productVariants.length === 0 ? (
        <Alert severity="info">Sản phẩm này không có biến thể nào.</Alert>
      ) : (
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={productVariants}
            columns={columns}
            rowCount={totalRows}
            paginationMode="server"
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize);
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.id}
            disableSelectionOnClick
            aria-label="Bảng biến thể sản phẩm"
            localeText={{
              noRowsLabel: "Không có dữ liệu",
            }}
          />
        </div>
      )}

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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
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

export default ProductVariantsManagement;
