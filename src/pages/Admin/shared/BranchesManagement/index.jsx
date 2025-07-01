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
  Alert,
  Snackbar,
  Box,
  IconButton,
} from "@mui/material";

import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListBranchesForAdminQuery,
  useAddBranchesMutation,
  useUpdateBranchesMutation,
  useDeleteBranchesMutation,
  useRestoreBranchesMutation,
} from "@/services/api/branches";
import { Add, Delete, Edit, Refresh, Restore } from "@mui/icons-material";
import ErrorDisplay from "../../../../components/ErrorDisplay";

const BranchesManagement = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedBranchesId, setSelectedBranchesId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newBranches, setNewBranches] = useState({
    name: "",
    location: "",
    phone: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    data: dataBranches,
    isLoading: isLoadingBranches,
    error: errorBranches,
    refetch,
  } = useListBranchesForAdminQuery(
    { page: paginationModel.page, size: paginationModel.pageSize },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [addBranches] = useAddBranchesMutation();
  const [updateBranches] = useUpdateBranchesMutation();
  const [deleteBranches] = useDeleteBranchesMutation();
  const [restoreBranches] = useRestoreBranchesMutation();

  const dataRowBranches = dataBranches?.result?.items || [];
  const totalRows = dataBranches?.result?.totalItems || 0;

  const columnsBranches = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên chi nhánh", width: 150 },
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
          <IconButton onClick={() => handleEditBranches(params.row.id)}>
            <Edit color="primary" />
          </IconButton>
          {params.row?.status === "INACTIVE" ? (
            <IconButton onClick={() => handleOpenRestoreDialog(params.row.id)}>
              <Restore color="success" />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleOpenDeleteDialog(params.row.id)}>
              <Delete color="error" />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedBranchesId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBranchesId(null);
  };

  const handleOpenRestoreDialog = (id) => {
    setSelectedBranchesId(id);
    setOpenRestoreDialog(true);
  };

  const handleCloseRestoreDialog = () => {
    setSelectedBranchesId(null);
    setOpenRestoreDialog(false);
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Danh sách chi nhánh đã được làm mới!",
      severity: "info",
    });
  };

  const handleDeleteBranches = async () => {
    try {
      await deleteBranches({ id: selectedBranchesId }).unwrap();
      setOpenDeleteDialog(false);
      setSelectedBranchesId(null);
      setSnackbar({
        open: true,
        message: "Xóa chi nhánh thành công!",
        severity: "success",
      });
      refetch();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleRestoreBranches = async () => {
    try {
      await restoreBranches({ id: selectedBranchesId }).unwrap();
      setSnackbar({
        open: true,
        message: "Khôi phục chi nhánh thành công!",
        severity: "success",
      });
      refetch();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
    setOpenRestoreDialog(false);
    setSelectedBranchesId(null);
  };

  const handleAddBranches = async (data) => {
    setSubmitted(true);

    try {
      await addBranches({
        name: data?.name,
        location: data?.location,
        phone: data?.phone,
      }).unwrap();
      setSnackbar({
        open: true,
        message: "Thêm chi nhánh thành công!",
        severity: "success",
      });
      setNewBranches({ name: "", location: "", phone: "" });
      setOpenAddDialog(false);
      setSubmitted(false);
      refetch();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  const handleEditBranches = (id) => {
    const branchesToEdit = dataRowBranches.find((item) => item.id === id);

    if (branchesToEdit) {
      setNewBranches({
        name: branchesToEdit.name,
        location: branchesToEdit.location,
        phone: branchesToEdit.phone,
      });
      setSelectedBranchesId(id);
      setOpenUpdateDialog(true);
    }
  };

  const handleUpdateBranches = async () => {
    setSubmitted(true);

    try {
      await updateBranches({
        id: selectedBranchesId,
        ...newBranches,
      }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Cập nhật chi nhánh thành công!",
      });
      setNewBranches({ name: "", location: "", phone: "" });
      setOpenUpdateDialog(false);
      setSubmitted(false);
      setSelectedBranchesId(null);
      refetch();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  if (errorBranches) {
    return (
      <ErrorDisplay
        error={
          errorBranches
            ? {
                message:
                  "Không tải được danh mục. Vui lòng kiểm tra kết nối của bạn và thử lại !",
              }
            : null
        }
      />
    );
  }

  return (
    <DashboardLayoutWrapper>
      <Box sx={{ m: "0 10px" }}>
        <Typography variant="h5" gutterBottom>
          Quản lý Chi nhánh
        </Typography>
        <Box
          sx={{ mb: 2 }}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Button
            variant="outlined"
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
            }}
            startIcon={<Add />}
          >
            Thêm chi nhánh
          </Button>
        </Box>

        <Box height={500} width={"100%"}>
          <DataGrid
            columns={columnsBranches}
            rows={dataRowBranches}
            loading={isLoadingBranches}
            disableSelectionOnClick
            slotProps={{
              loadingOverlay: {
                variant: "linear-progress",
                noRowsVariant: "linear-progress",
              },
            }}
            localeText={{
              noRowsLabel: "Không có dữ liệu",
            }}
            pagination
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            rowCount={totalRows}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 15, 20]}
          />
        </Box>

        {/* TODO: Dialog add branches */}
        <Dialog
          open={openAddDialog}
          onClose={() => {
            setOpenAddDialog(false);
            setSubmitted(false);
            setNewBranches({ name: "", location: "", phone: "" });
          }}
        >
          <DialogTitle>Thêm chi nhánh</DialogTitle>
          <DialogContent>
            <TextField
              label="Tên chi nhánh"
              value={newBranches.name}
              onChange={(e) =>
                setNewBranches({ ...newBranches, name: e.target.value })
              }
              fullWidth
              sx={{ mt: 2 }}
              error={submitted && !newBranches.name}
              helperText={
                submitted && !newBranches.name ? "name không được để trống" : ""
              }
            />
            <TextField
              label="Địa điểm"
              value={newBranches.location}
              onChange={(e) =>
                setNewBranches({ ...newBranches, location: e.target.value })
              }
              fullWidth
              sx={{ mt: 2 }}
              error={submitted && !newBranches.location}
              helperText={
                submitted && !newBranches.location
                  ? "location không được để trống"
                  : ""
              }
            />
            <TextField
              label="Số điện thoại"
              value={newBranches.phone}
              onChange={(e) =>
                setNewBranches({ ...newBranches, phone: e.target.value })
              }
              fullWidth
              sx={{ mt: 2 }}
              error={submitted && !newBranches.phone}
              helperText={
                submitted && !newBranches.phone
                  ? "phone không được để trống"
                  : ""
              }
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button color="error" onClick={() => setOpenAddDialog(false)}>
              Hủy
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddBranches(newBranches)}
            >
              Thêm
            </Button>
          </DialogActions>
        </Dialog>

        {/* TODO: Dialog update branches */}
        <Dialog
          open={openUpdateDialog}
          onClose={() => {
            setOpenUpdateDialog(false);
            setSubmitted(false);
          }}
        >
          <DialogTitle>Cập nhật chi nhánh</DialogTitle>
          <DialogContent>
            <TextField
              label="Tên chi nhánh"
              value={newBranches.name}
              onChange={(e) =>
                setNewBranches({ ...newBranches, name: e.target.value })
              }
              fullWidth
              sx={{ mt: 2 }}
              error={submitted && !newBranches.name}
              helperText={
                submitted && !newBranches.name ? "name không được để trống" : ""
              }
            />
            <TextField
              label="Địa điểm"
              value={newBranches.location}
              onChange={(e) =>
                setNewBranches({ ...newBranches, location: e.target.value })
              }
              fullWidth
              sx={{ mt: 2 }}
              error={submitted && !newBranches.location}
              helperText={
                submitted && !newBranches.location
                  ? "location không được để trống"
                  : ""
              }
            />
            <TextField
              label="Số điện thoại"
              value={newBranches.phone}
              onChange={(e) =>
                setNewBranches({ ...newBranches, phone: e.target.value })
              }
              fullWidth
              sx={{ mt: 2 }}
              error={submitted && !newBranches.phone}
              helperText={
                submitted && !newBranches.phone
                  ? "phone không được để trống"
                  : ""
              }
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button color="error" onClick={() => setOpenUpdateDialog(false)}>
              Hủy
            </Button>
            <Button variant="contained" onClick={handleUpdateBranches}>
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Xác nhận xóa ?</DialogTitle>
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
              onClick={handleDeleteBranches}
              color="error"
              variant="contained"
              autoFocus
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openRestoreDialog} onClose={handleCloseRestoreDialog}>
          <DialogTitle>Xác nhận khôi phục ?</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn khôi phục chi nhánh này không ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleCloseRestoreDialog}>
              Huỷ
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleRestoreBranches}
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
