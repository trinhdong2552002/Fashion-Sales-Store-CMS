import React, { useState, useEffect, Component } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Box,
  PaginationItem,
  styled,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useRestoreCategoryMutation,
} from "@/services/api/categories";
import { useGetMyInfoQuery } from "@/services/api/auth";
import {
  setCategories,
  setLoading as setCategoryLoading,
  setError as setCategoryError,
  selectCategories,
} from "@/store/redux/categories/reducer";

// Tùy chỉnh nút Back và Forward
const CustomPaginationItem = styled(PaginationItem)(({ theme }) => ({
  "&.MuiPaginationItem-previousNext": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "&.Mui-disabled": {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
    },
    borderRadius: "4px",
    margin: "0 5px",
    padding: "8px",
  },
}));

// ErrorBoundary component để bắt lỗi
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.categoriesData !== this.props.categoriesData &&
      this.state.hasError
    ) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error">
          Đã xảy ra lỗi khi hiển thị bảng danh mục.
        </Alert>
      );
    }
    return this.props.children;
  }
}

const CategoriesManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);

  const [page, setPage] = useState(0); // Trang bắt đầu từ 0
  const [pageSize, setPageSize] = useState(10); // Mỗi trang 10 danh mục
  const [totalRows, setTotalRows] = useState(0); // Tổng số danh mục
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editCategory, setEditCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Kiểm tra thông tin người dùng và quyền admin
  const {
    data: userInfo,
    error: userError,
    isLoading: userLoading,
  } = useGetMyInfoQuery();

  // Lấy danh sách danh mục với phân trang
  const {
    data: categoriesData,
    isLoading: isFetchingCategories,
    error: fetchCategoriesError,
    refetch: refetchCategories,
  } = useListCategoriesQuery(
    { pageNo: page + 1, pageSize },
    {
      skip: userLoading,
      refetchOnMountOrArgChange: true, // Force refetch on mount or argument change
    }
  );

  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [restoreCategory] = useRestoreCategoryMutation();

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

  useEffect(() => {
    dispatch(setCategoryLoading(isFetchingCategories));
    if (fetchCategoriesError) {
      const errorMessage =
        fetchCategoriesError?.data?.message || "Lỗi khi tải danh sách danh mục";
      dispatch(setCategoryError(errorMessage));
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } else if (categoriesData && categoriesData.items) {
      const validCategories = categoriesData.items.filter(
        (category) => category && category.id && category.name
      );
      dispatch(setCategories(validCategories));
      dispatch(setCategoryError(null));
      setTotalRows(categoriesData.totalItems || 0);
      console.log("Categories in state after filtering:", validCategories);
      console.log("Total rows:", categoriesData.totalItems);
    } else {
      dispatch(setCategories([]));
      setTotalRows(0);
    }
  }, [categoriesData, isFetchingCategories, fetchCategoriesError, dispatch]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên", width: 150 },
    { field: "description", headerName: "Mô tả", width: 200 },
    { field: "createdBy", headerName: "Người tạo", width: 200 },
    { field: "createdAt", headerName: "Ngày tạo", width: 120 },
    { field: "status", headerName: "Trạng thái", width: 120 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="text"
            color="primary"
            onClick={() => handleEditCategory(params.row)}
          >
            Sửa
          </Button>
          {params.row.status === "ACTIVE" ? (
            <Button
              variant="text"
              color="error"
              onClick={() => handleOpenDeleteDialog(params.row.id)}
            >
              Xóa
            </Button>
          ) : (
            <Button
              variant="text"
              color="success"
              onClick={() => handleRestoreCategory(params.row.id)}
            >
              Khôi phục
            </Button>
          )}
        </>
      ),
    },
  ];

  const handleAddCategory = async () => {
    try {
      await addCategory(newCategory).unwrap();
      setNewCategory({ name: "", description: "" });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Thêm danh mục thành công!",
        severity: "success",
      });
      refetchCategories();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi thêm danh mục";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description || "",
    });
    setOpenDialog(true);
  };

  const handleUpdateCategory = async () => {
    try {
      await updateCategory({
        id: editCategory.id,
        ...newCategory,
      }).unwrap();
      setEditCategory(null);
      setNewCategory({ name: "", description: "" });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Cập nhật danh mục thành công!",
        severity: "success",
      });
      refetchCategories();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi cập nhật danh mục";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setCategoryToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(categoryToDelete).unwrap();
      setOpenDeleteDialog(false);
      setCategoryToDelete(null);
      setSnackbar({
        open: true,
        message: "Xóa danh mục thành công!",
        severity: "success",
      });
      refetchCategories();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi xóa danh mục";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleRestoreCategory = async (id) => {
    try {
      await restoreCategory(id).unwrap();
      setSnackbar({
        open: true,
        message: "Khôi phục danh mục thành công!",
        severity: "success",
      });
      refetchCategories();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi khôi phục danh mục";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditCategory(null);
    setNewCategory({ name: "", description: "" });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCategoryToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    setPage(0); // Reset to first page on refresh
    refetchCategories();
    setSnackbar({
      open: true,
      message: "Danh sách danh mục đã được làm mới!",
      severity: "info",
    });
  };

  if (userLoading || isFetchingCategories) {
    return <CircularProgress />;
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Danh mục
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={9}>
          <Button variant="outlined" onClick={handleRefresh}>
            <RefreshIcon sx={{ mr: 1 }} />
            Làm mới
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            fullWidth
          >
            Thêm danh mục
          </Button>
        </Grid>
      </Grid>

      {fetchCategoriesError ? (
        <Alert severity="error">
          {fetchCategoriesError?.data?.message || "Lỗi khi tải danh mục"}
        </Alert>
      ) : categories.length === 0 ? (
        <Alert severity="info">Hiện tại không có danh mục nào.</Alert>
      ) : (
        <ErrorBoundary categoriesData={categoriesData}>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={categories}
              columns={columns}
              paginationMode="server" // Phân trang phía server
              rowCount={totalRows} // Tổng số danh mục
              page={page}
              pageSize={pageSize}
              onPageChange={(newPage) => {
                console.log("Page changed to:", newPage); 
                setPage(newPage);
              }}
              onPageSizeChange={(newPageSize) => {
                console.log("Page size changed to:", newPageSize); 
                setPageSize(newPageSize);
                setPage(0); // Reset về trang đầu khi đổi pageSize
              }}
              rowsPerPageOptions={[10, 20, 50]} // Tùy chọn số hàng mỗi trang
              getRowId={(row) => row.id}
              disableSelectionOnClick
              loading={isFetchingCategories}
              localeText={{
                noRowsLabel: "Hiện tại không có danh mục nào",
              }}
              slots={{
                pagination: () => (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={2}
                  >
                    <Typography variant="body2">
                      Tổng số danh mục: {totalRows}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <CustomPaginationItem
                        type="previous"
                        component={Button}
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                      />
                      <Typography variant="body2" mx={2}>
                        Trang {page + 1} / {Math.ceil(totalRows / pageSize)}
                      </Typography>
                      <CustomPaginationItem
                        type="next"
                        component={Button}
                        disabled={page >= Math.ceil(totalRows / pageSize) - 1}
                        onClick={() => setPage(page + 1)}
                      />
                    </Box>
                  </Box>
                ),
              }}
            />
          </div>
        </ErrorBoundary>
      )}

      {/* Dialog thêm/sửa danh mục */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="category-dialog-title"
        aria-describedby="category-dialog-description"
      >
        <DialogTitle id="category-dialog-title">
          {editCategory ? "Sửa danh mục" : "Thêm danh mục"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="Mô tả"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCloseDialog}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={editCategory ? handleUpdateCategory : handleAddCategory}
          >
            {editCategory ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa danh mục
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không
            thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteCategory} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000} // Increase duration to match ProductImagesManagement
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

export default CategoriesManagement;
