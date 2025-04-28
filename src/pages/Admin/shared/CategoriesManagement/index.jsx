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
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
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

const CategoriesManagement = () => {
  const navigate = useNavigate();

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

  useEffect(() => {
    if (userError) {
      setSnackbar({
        open: true,
        message:
          "Bạn cần đăng nhập để truy cập trang này: " +
          (userError?.data?.message || "Lỗi không xác định"),
        severity: "error",
      });
      setTimeout(() => navigate("/login"), 2000);
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

  // Lấy danh sách danh mục bằng RTK Query
  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useListCategoriesQuery();

  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [restoreCategory] = useRestoreCategoryMutation();

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
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.data?.message || "Lỗi khi thêm danh mục",
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.data?.message || "Lỗi khi cập nhật danh mục",
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.data?.message || "Lỗi khi xóa danh mục",
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.data?.message || "Lỗi khi khôi phục danh mục",
        severity: "error",
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditCategory(null);
    setNewCategory({ name: "", description: "" });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Danh sách danh mục đã được làm mới!",
      severity: "info",
    });
  };

  if (userLoading) {
    return <CircularProgress />;
  }

  const rows = categoriesData?.items || [];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Danh mục
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={9}>
          <Button
            variant="outlined"
            onClick={handleRefresh}
          >
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

      {error ? (
        <Alert severity="error">
          {error.data?.message || "Lỗi khi tải danh mục"}
        </Alert>
      ) : (
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20, 100]}
            disableSelectionOnClick
            loading={isLoading}
            localeText={{
              noRowsLabel: "Hiện tại không có danh mục nào",
            }}
          />
        </div>
      )}

      {/* Dialog thêm/sửa danh mục */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
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
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa danh mục này không?</Typography>
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
            onClick={handleDeleteCategory}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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