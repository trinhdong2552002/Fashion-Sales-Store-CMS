import React, { useState, useEffect, Fragment } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Grid,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useAddCategoriesMutation,
  useDeleteCategoriesMutation,
  useListCategoriesForAdminQuery,
  useRestoreCategoriesMutation,
  useUpdateCategoriesMutation,
} from "../../../../services/api/categories";

const CategoriesManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedCategoriesId, setSelectedCategoriesId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newCategories, setNewCategories] = useState({
    name: "",
    description: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedCategoriesId(id);
    setOpenDeleteDialog(true);
  };

  const handleOpenRestoreDialog = (id) => {
    setSelectedCategoriesId(id);
    setOpenRestoreDialog(true);
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Danh mục đã được làm mới!",
      severity: "info",
    });
  };

  // TODO: UseQuery with two parameters useQuery(arg, options)
  const {
    data: dataCategories,
    isLoading: isLoadingCategories,
    isError: errorCategories,
    refetch,
  } = useListCategoriesForAdminQuery(
    {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const [addCategories] = useAddCategoriesMutation();
  const [updateCategories] = useUpdateCategoriesMutation();
  const [deleteCategories] = useDeleteCategoriesMutation();
  const [restoreCategories] = useRestoreCategoriesMutation();

  const dataRowCategories = dataCategories?.result?.items || [];
  const totalRows = dataCategories?.result?.totalItems || 0;

  const columnsCategories = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên danh mục", width: 200 },
    { field: "description", headerName: "Mô tả danh mục", width: 200 },
    { field: "status", headerName: "Trạng thái", width: 200 },
    { field: "createdBy", headerName: "Người tạo", width: 200 },
    { field: "updatedBy", headerName: "Người cập nhật", width: 200 },
    { field: "createdAt", headerName: "Ngày tạo", width: 200 },
    { field: "updatedAt", headerName: "Ngày cập nhật", width: 200 },
    {
      field: "action",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <Fragment>
          <IconButton onClick={() => handleEditCategories(params.row.id)}>
            <EditIcon color="primary" />
          </IconButton>
          {params.row?.status === "INACTIVE" ? (
            <IconButton onClick={() => handleOpenRestoreDialog(params.row.id)}>
              <RestoreIcon color="success" />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleOpenDeleteDialog(params.row.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          )}
        </Fragment>
      ),
    },
  ];

  const handleDeleteCategories = async () => {
    try {
      await deleteCategories({ id: selectedCategoriesId }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Xoá danh mục thành công!",
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Xoá danh mục thất bại!",
      });
      console.error("Delete error:", error);
    }
    setOpenDeleteDialog(false);
    setSelectedCategoriesId(null);
  };

  const handleRestoreCategories = async () => {
    try {
      await restoreCategories({ id: selectedCategoriesId }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Khôi phục danh mục thành công!",
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Khôi phục danh mục thất bại!",
      });
      console.error("Restore error:", error);
    }
    setOpenRestoreDialog(false);
    setSelectedCategoriesId(null);
  };

  const handleAddCategories = async (data) => {
    try {
      await addCategories({
        name: data?.name,
        description: data?.description,
      }).unwrap();
      console.log("Add categories", addCategories);
      setNewCategories({ name: "", description: "" });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Thêm danh mục thành công!",
      });
      refetch();
    } catch (error) {
      console.log("Error add categories", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Thêm danh mục thất bại!",
      });
    }
  };

  const handleEditCategories = async (id) => {
    const categoryToEdit = dataRowCategories.find((item) => item.id === id);
    if (categoryToEdit) {
      setNewCategories({
        name: categoryToEdit.name,
        description: categoryToEdit.description,
      });
      setSelectedCategoriesId(id);
      setIsEditMode(true);
      setOpenDialog(true);
    }
  };

  const handleUpdateCategories = async () => {
    try {
      await updateCategories({
        id: selectedCategoriesId,
        name: newCategories.name,
        description: newCategories.description,
      }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Cập nhật danh mục thành công!",
      });
      setNewCategories({ name: "", description: "" });
      setOpenDialog(false);
      setIsEditMode(false);
      setSelectedCategoriesId(null);
      refetch();
    } catch (error) {
      console.log("Update error", error);
    }
  };

  if (errorCategories) return <p>Error loading category.</p>;

  return (
    <DashboardLayoutWrapper>
      <Box sx={{ m: "0 10px" }}>
        <Typography variant="h5" gutterBottom>
          Quản lý Danh mục
        </Typography>
        <Grid
          container
          sx={{ mb: 2 }}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button variant="outlined" onClick={handleRefresh}>
              <RefreshIcon />
              Làm mới
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                setNewCategories({ name: "", description: "" });
                setIsEditMode(false);
                setOpenDialog(true);
              }}
            >
              Thêm danh mục
            </Button>
          </Grid>
        </Grid>

        <Box height={500} width={"100%"}>
          <DataGrid
            columns={columnsCategories}
            rows={dataRowCategories}
            loading={isLoadingCategories}
            slotProps={{
              loadingOverlay: {
                variant: "linear-progress",
                noRowsVariant: "linear-progress",
              },
            }}
            pagination
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            rowCount={totalRows}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 50]}
          />
        </Box>

        {/* TODO: Dialog add categories */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            {isEditMode ? "Cập nhật danh mục" : "Thêm danh mục"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Tên danh mục"
              value={newCategories.name}
              onChange={(e) =>
                setNewCategories({ ...newCategories, name: e.target.value })
              }
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Mô tả danh mục"
              value={newCategories.description}
              onChange={(e) =>
                setNewCategories({
                  ...newCategories,
                  description: e.target.value,
                })
              }
              fullWidth
              sx={{ mt: 3 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button color="error" onClick={() => setOpenDialog(false)}>
              Huỷ
            </Button>
            {isEditMode ? (
              <Button variant="contained" onClick={handleUpdateCategories}>
                Cập nhật
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => handleAddCategories(newCategories)}
              >
                Thêm
              </Button>
            )}
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Xác nhận xoá</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xoá danh mục này không?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={() => setOpenDeleteDialog(false)}>
              Huỷ
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteCategories}
            >
              Xoá
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openRestoreDialog}
          onClose={() => setOpenRestoreDialog(false)}
        >
          <DialogTitle>Xác nhận khôi phục</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn khôi phục danh mục này không?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={() => setOpenRestoreDialog(false)}>
              Huỷ
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleRestoreCategories}
            >
              Khôi phục
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="standard"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayoutWrapper>
  );
};

export default CategoriesManagement;
