import { useState } from "react";
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
  Alert,
  Snackbar,
  Box,
  IconButton,
} from "@mui/material";

import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListBranchesForAdminQuery,
  useAddBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useRestoreBranchMutation,
} from "@/services/api/branches";
import { Delete, Edit, Refresh, Restore } from "@mui/icons-material";

const BranchesManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedBranchesId, setSelectedBranchesId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [newBranch, setNewBranch] = useState({
    name: "",
    location: "",
    phone: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedBranchesId(id);
    setOpenDeleteDialog(true);
  };

  const handleOpenRestoreDialog = (id) => {
    setSelectedBranchesId(id);
    setOpenRestoreDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBranchesId(null);
  };

  const {
    data: dataBranches,
    isLoading: isLoadingBranches,
    error: isErrorBranches,
    refetch: refetchBranches,
  } = useListBranchesForAdminQuery(
    { pageNo: paginationModel.page + 1, pageSize: paginationModel.pageSize },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  console.log("data branches", dataBranches);

  const [addBranch] = useAddBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();
  const [deleteBranch] = useDeleteBranchMutation();
  const [restoreBranch] = useRestoreBranchMutation();

  const dataRowBranches = dataBranches?.result?.items || [];
  const totalRows = dataBranches?.result?.totalItems || 0;

  const columnsBranches = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên", width: 150 },
    { field: "location", headerName: "Địa điểm", width: 200 },
    { field: "phone", headerName: "Số điện thoại", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 120 },
    { field: "createdBy", headerName: "Người tạo", width: 200 },
    { field: "updatedBy", headerName: "Người cập nhật", width: 200 },
    { field: "createdAt", headerName: "Ngày tạo", width: 120 },
    { field: "updatedAt", headerName: "Ngày cập nhật", width: 120 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditBranch(params.row)}>
            <Edit color="primary" />
          </IconButton>
          {params.row.status === "ACTIVE" ? (
            <IconButton
              variant="text"
              color="error"
              onClick={() => handleOpenDeleteDialog(params.row.id)}
            >
              <Delete />
            </IconButton>
          ) : (
            <IconButton
              variant="text"
              color="success"
              onClick={() => handleOpenRestoreDialog(params.row.id)}
            >
              <Restore />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const handleAddBranch = async () => {
    try {
      await addBranch(newBranch).unwrap();
      setNewBranch({ name: "", location: "", phone: "" });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Thêm chi nhánh thành công!",
        severity: "success",
      });
      refetchBranches();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi thêm chi nhánh";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleEditBranch = (branch) => {
    setIsEditMode(true);
    setNewBranch({
      name: branch.name,
      location: branch.location || "",
      phone: branch.phone || "",
    });
    setOpenDialog(true);
  };

  const handleUpdateBranch = async () => {
    try {
      await updateBranch({
        id: isEditMode.id,
        ...newBranch,
      }).unwrap();
      setIsEditMode(null);
      setNewBranch({ name: "", location: "", phone: "" });
      setOpenDialog(false);
      setIsEditMode(false);
      setSnackbar({
        open: true,
        message: "Cập nhật chi nhánh thành công!",
        severity: "success",
      });
      refetchBranches();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi cập nhật chi nhánh";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleDeleteBranch = async () => {
    try {
      await deleteBranch(selectedBranchesId).unwrap();
      setOpenDeleteDialog(false);
      setSelectedBranchesId(null);
      setSnackbar({
        open: true,
        message: "Xóa chi nhánh thành công!",
        severity: "success",
      });
      refetchBranches();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi xóa chi nhánh";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleRestoreBranch = async () => {
    try {
      await restoreBranch({ id: selectedBranchesId }).unwrap();
      setSnackbar({
        open: true,
        message: "Khôi phục chi nhánh thành công!",
        severity: "success",
      });
      refetchBranches();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi khôi phục chi nhánh";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
    setOpenRestoreDialog(false);
    setSelectedBranchesId(null);
  };

  const handleRefresh = () => {
    refetchBranches();
    setSnackbar({
      open: true,
      message: "Danh sách chi nhánh đã được làm mới!",
      severity: "info",
    });
  };

  if (isErrorBranches) {
    <div>Error branches</div>;
  }

  return (
    <DashboardLayoutWrapper>
      <Box sx={{ m: "0 10px" }}>
        <Typography variant="h5" gutterBottom>
          Quản lý Chi nhánh
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
              <Refresh />
              Làm mới
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
              fullWidth
            >
              Thêm chi nhánh
            </Button>
          </Grid>
        </Grid>

        <Box height={500} width={"100%"}>
          <DataGrid
            columns={columnsBranches}
            rows={dataRowBranches}
            loading={isLoadingBranches}
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
            pageSizeOptions={[5, 10, 15]}
          />
        </Box>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="branch-dialog-title"
          aria-describedby="branch-dialog-description"
        >
          <DialogTitle id="branch-dialog-title">
            {isEditMode ? "Sửa chi nhánh" : "Thêm chi nhánh"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Tên"
              value={newBranch.name}
              onChange={(e) =>
                setNewBranch({ ...newBranch, name: e.target.value })
              }
              fullWidth
              sx={{ mt: 2 }}
              required
            />
            <TextField
              label="Địa điểm"
              value={newBranch.location}
              onChange={(e) =>
                setNewBranch({ ...newBranch, location: e.target.value })
              }
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Số điện thoại"
              value={newBranch.phone}
              onChange={(e) =>
                setNewBranch({ ...newBranch, phone: e.target.value })
              }
              fullWidth
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={() => setOpenDialog(false)}>
              Hủy
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={isEditMode ? handleUpdateBranch : handleAddBranch}
            >
              {isEditMode ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Xác nhận xóa ?</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Bạn có chắc chắn muốn xoá chi nhánh này không ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="error">
              Hủy
            </Button>
            <Button
              onClick={handleDeleteBranch}
              color="error"
              variant="contained"
              autoFocus
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openRestoreDialog}
          onClose={() => setOpenRestoreDialog(false)}
        >
          <DialogTitle>Xác nhận khôi phục ?</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn khôi phục chi nhánh này không ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={() => setOpenRestoreDialog(false)}>
              Huỷ
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleRestoreBranch}
            >
              Khôi phục
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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

export default BranchesManagement;
