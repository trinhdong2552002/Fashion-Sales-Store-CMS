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
  IconButton,
  Box,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListPromotionsQuery,
  useAddPromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useRestorePromotionMutation,
} from "@/services/api/promotion";
import { Add, Delete, Edit, Refresh, Restore } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";

const PromotionsManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newPromotion, setNewPromotion] = useState({
    code: "",
    description: "",
    discountPercent: "",
    startDate: "",
    endDate: "",
  });

  const {
    data: dataPromotions,
    isLoading: isLoadingPromotions,
    isError: isErrorPromotions,
    refetch,
  } = useListPromotionsQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [addPromotion] = useAddPromotionMutation();
  const [updatePromotion] = useUpdatePromotionMutation();
  const [deletePromotion] = useDeletePromotionMutation();
  const [restorePromotion] = useRestorePromotionMutation();

  const dataRowPromotions = dataPromotions?.result?.items || [];
  const totalRows = dataPromotions?.result?.totalItems || 0;

  const columnsPromotion = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "code", headerName: "Mã khuyến mãi", width: 200 },
    { field: "description", headerName: "Mô tả", width: 200 },
    { field: "discountPercent", headerName: "Giảm giá (%)", width: 150 },
    { field: "startDate", headerName: "Ngày bắt đầu", width: 200 },
    { field: "endDate", headerName: "Ngày kết thúc", width: 200 },
    { field: "status", headerName: "Trạng thái", width: 200 },
    { field: "createdBy", headerName: "Người tạo", width: 200 },
    { field: "createdAt", headerName: "Ngày tạo", width: 200 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditPromotion(params.row.id)}>
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
    setSelectedPromotionId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedPromotionId(null);
    setOpenDeleteDialog(false);
  };

  const handleOpenRestoreDialog = (id) => {
    setSelectedPromotionId(id);
    setOpenRestoreDialog(true);
  };

  const handleCloseRestoreDialog = () => {
    setSelectedPromotionId(null);
    setOpenRestoreDialog(false);
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Danh sách khuyến mãi đã được làm mới!",
      severity: "info",
    });
  };

  const handleAddPromotion = async () => {
    setSubmitted(true);

    try {
      await addPromotion({
        ...newPromotion,
        discountPercent: parseFloat(newPromotion.discountPercent),
      }).unwrap();
      setNewPromotion({
        code: "",
        description: "",
        discountPercent: "",
        startDate: "",
        endDate: "",
      });
      setOpenAddDialog(false);
      setSubmitted(false);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Thêm khuyến mãi thành công!",
      });
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  const handleEditPromotion = (id) => {
    const promotionToEdit = dataRowPromotions.find((item) => item.id === id);

    if (promotionToEdit) {
      setNewPromotion({
        code: promotionToEdit.code,
        description: promotionToEdit.description || "",
        discountPercent: promotionToEdit.discountPercent,
        startDate: promotionToEdit.startDate,
        endDate: promotionToEdit.endDate,
      });
      setSelectedPromotionId(id);
      setOpenEditDialog(true);
    }
  };

  const handleUpdatePromotion = async () => {
    setSubmitted(true);

    try {
      await updatePromotion({
        id: selectedPromotionId,
        ...newPromotion,
      }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Cập nhật khuyến mãi thành công!",
      });
      setNewPromotion({
        code: "",
        description: "",
        discountPercent: "",
        startDate: "",
        endDate: "",
      });
      setSelectedPromotionId(null);
      setOpenEditDialog(false);
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

  const handleDeletePromotion = async () => {
    try {
      await deletePromotion({ id: selectedPromotionId }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Xóa khuyến mãi thành công!",
      });
      setOpenDeleteDialog(false);
      setSelectedPromotionId(null);
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

  const handleRestorePromotion = async () => {
    try {
      await restorePromotion({ id: selectedPromotionId }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Khôi phục danh mục thành công !",
      });
      setOpenRestoreDialog(false);
      setSelectedPromotionId(null);
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

  if (isErrorPromotions)
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách khuyến mãi. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý khuyến mãi
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
          startIcon={<Add />}
          onClick={() => {
            setOpenAddDialog(true);
            setNewPromotion({
              code: "",
              description: "",
              discountPercent: "",
              startDate: "",
              endDate: "",
            });
          }}
        >
          Thêm khuyến mãi
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
          columns={columnsPromotion}
          rows={dataRowPromotions}
          loading={isLoadingPromotions}
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

      {/* TODO: Dialog add promotion */}
      <Dialog open={openAddDialog}>
        <DialogTitle>Thêm khuyến mãi</DialogTitle>
        <DialogContent>
          <TextField
            label="Mã khuyến mãi"
            value={newPromotion.code}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, code: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newPromotion.code}
            helperText={
              submitted && !newPromotion.code ? "code không được để trống" : ""
            }
          />
          <TextField
            label="Mô tả"
            value={newPromotion.description}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newPromotion.description}
            helperText={
              submitted && !newPromotion.description
                ? "description không được để trống"
                : ""
            }
          />
          <TextField
            label="Giảm giá (%)"
            type="number"
            value={newPromotion.discountPercent}
            onChange={(e) =>
              setNewPromotion({
                ...newPromotion,
                discountPercent: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newPromotion.discountPercent}
            helperText={
              submitted && !newPromotion.discountPercent
                ? "discountPercent không được để trống"
                : ""
            }
          />
          <TextField
            label="Ngày bắt đầu"
            type="date"
            value={newPromotion.startDate}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, startDate: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
            error={submitted && !newPromotion.startDate}
            helperText={
              submitted && !newPromotion.startDate
                ? "startDate không được để trống"
                : ""
            }
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            value={newPromotion.endDate}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, endDate: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
            error={submitted && !newPromotion.endDate}
            helperText={
              submitted && !newPromotion.endDate
                ? "endDate không được để trống"
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenAddDialog(false)}>
            Hủy
          </Button>
          <Button onClick={handleAddPromotion} variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* TODO: Dialog edit promotion */}
      <Dialog open={openEditDialog}>
        <DialogTitle>Cập nhật khuyến mãi</DialogTitle>
        <DialogContent>
          <TextField
            label="Mã khuyến mãi"
            value={newPromotion.code}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, code: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newPromotion.code}
            helperText={
              submitted && !newPromotion.code ? "code không được để trống" : ""
            }
          />
          <TextField
            label="Mô tả"
            value={newPromotion.description}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newPromotion.description}
            helperText={
              submitted && !newPromotion.description
                ? "description không được để trống"
                : ""
            }
          />
          <TextField
            label="Giảm giá (%)"
            type="number"
            value={newPromotion.discountPercent}
            onChange={(e) =>
              setNewPromotion({
                ...newPromotion,
                discountPercent: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newPromotion.discountPercent}
            helperText={
              submitted && !newPromotion.discountPercent
                ? "discountPercent không được để trống"
                : ""
            }
          />
          <TextField
            label="Ngày bắt đầu"
            type="date"
            value={newPromotion.startDate}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, startDate: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
            error={submitted && !newPromotion.startDate}
            helperText={
              submitted && !newPromotion.startDate
                ? "startDate không được để trống"
                : ""
            }
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            value={newPromotion.endDate}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, endDate: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
            error={submitted && !newPromotion.endDate}
            helperText={
              submitted && !newPromotion.endDate
                ? "endDate không được để trống"
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenEditDialog(false)}>
            Hủy
          </Button>
          <Button onClick={handleUpdatePromotion} variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog}>
        <DialogTitle>Xác nhận xóa ?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khuyến mãi này không ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseDeleteDialog}>
            Hủy
          </Button>
          <Button
            onClick={handleDeletePromotion}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRestoreDialog}>
        <DialogTitle>Xác nhận khôi phục ?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn khôi phục khuyến mãi này không ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseRestoreDialog}>
            Hủy
          </Button>
          <Button
            onClick={handleRestorePromotion}
            color="success"
            variant="contained"
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

export default PromotionsManagement;
