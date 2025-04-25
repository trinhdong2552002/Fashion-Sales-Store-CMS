import React, { useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} from "@/services/api/color";

const ColorsManagement = () => {
  const { data, isLoading, error } = useListColorsQuery();
  const [addColor] = useAddColorMutation();
  const [updateColor] = useUpdateColorMutation();
  const [deleteColor] = useDeleteColorMutation();

  const [newColor, setNewColor] = useState({ name: "" });
  const [editColor, setEditColor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [colorToDelete, setColorToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên màu sắc", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEditColor(params.row)}>Sửa</Button>
          <Button
            onClick={() => handleOpenDeleteDialog(params.row.id)}
            color="error"
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  const handleAddColor = async () => {
    try {
      await addColor(newColor).unwrap();
      setNewColor({ name: "" });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Thêm màu sắc thành công!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Lỗi khi thêm màu sắc: " + (error.data?.message || error.message),
      });
    }
  };

  const handleEditColor = (color) => {
    setEditColor(color);
    setNewColor({ name: color.name });
    setOpenDialog(true);
  };

  const handleUpdateColor = async () => {
    try {
      await updateColor({ id: editColor.id, ...newColor }).unwrap();
      setEditColor(null);
      setNewColor({ name: "" });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Cập nhật màu sắc thành công!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Lỗi khi cập nhật màu sắc: " + (error.data?.message || error.message),
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setColorToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteColor = async () => {
    try {
      await deleteColor(colorToDelete).unwrap();
      setOpenDeleteDialog(false);
      setColorToDelete(null);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Xóa màu sắc thành công!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Lỗi khi xóa màu sắc: " + (error.data?.message || error.message),
      });
    }
  };

  const rows = data?.items || [];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý màu sắc
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={9}></Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            fullWidth
          >
            Thêm màu sắc
          </Button>
        </Grid>
      </Grid>
      {error && (
        <Typography color="error" gutterBottom>
          Lỗi khi tải dữ liệu: {error.data?.message || "Không thể kết nối đến server"}
        </Typography>
      )}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          loading={isLoading}
          localeText={{
            noRowsLabel: "Không có dữ liệu",
          }}
        />
      </div>

      {/* Dialog thêm/sửa màu sắc */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editColor ? "Sửa màu sắc" : "Thêm màu sắc"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên màu sắc"
            value={newColor.name}
            onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={editColor ? handleUpdateColor : handleAddColor}
            variant="contained"
          >
            {editColor ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa màu sắc không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleDeleteColor} color="error" variant="contained">
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

export default ColorsManagement;