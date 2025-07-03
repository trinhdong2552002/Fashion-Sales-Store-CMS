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
} from "@/services/api/promotion";
import { Add, Delete, Edit, Refresh } from "@mui/icons-material";
import ErrorDisplay from "../../../../components/ErrorDisplay";

const PromotionsManagement = () => {
  const [addPromotion] = useAddPromotionMutation();
  const [updatePromotion] = useUpdatePromotionMutation();
  const [deletePromotion] = useDeletePromotionMutation();
  const [newPromotion, setNewPromotion] = useState({
    code: "",
    description: "",
    discountPercent: "",
    startDate: "",
    endDate: "",
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [editPromotion, setEditPromotion] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
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

  const dataRowPromotions = dataPromotions?.result?.items || [];
  const totalRows = dataPromotions?.result?.totalItems || 0;

  const columnsPromotion = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "code", headerName: "Mã khuyến mãi", width: 200 },
    { field: "description", headerName: "Mô tả", width: 200 },
    { field: "discountPercent", headerName: "Giảm giá (%)", width: 150 },
    { field: "startDate", headerName: "Ngày bắt đầu", width: 200 },
    { field: "endDate", headerName: "Ngày kết thúc", width: 200 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditPromotion(params.row)}>
            <Edit color="primary" />
          </IconButton>
          <IconButton
            onClick={() => handleOpenDeleteDialog(params.row.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Danh sách khuyến mãi đã được làm mới!",
      severity: "info",
    });
  };

  const handleOpenDeleteDialog = (id) => {
    setPromotionToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleAddPromotion = async () => {
    try {
      const promotionData = {
        ...newPromotion,
        discountPercent: parseFloat(newPromotion.discountPercent),
      };
      await addPromotion(promotionData).unwrap();
      setNewPromotion({
        code: "",
        description: "",
        discountPercent: "",
        startDate: "",
        endDate: "",
      });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Thêm khuyến mãi thành công!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          "Lỗi khi thêm khuyến mãi: " + (error.data?.message || error.message),
      });
    }
  };

  const handleEditPromotion = (promotion) => {
    setEditPromotion(promotion);
    setNewPromotion({
      code: promotion.code,
      description: promotion.description || "",
      discountPercent: promotion.discountPercent,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
    });
    setOpenDialog(true);
  };

  const handleUpdatePromotion = async () => {
    try {
      const promotionData = {
        ...newPromotion,
        discountPercent: parseFloat(newPromotion.discountPercent),
      };
      await updatePromotion({
        id: editPromotion.id,
        ...promotionData,
      }).unwrap();
      setEditPromotion(null);
      setNewPromotion({
        code: "",
        description: "",
        discountPercent: "",
        startDate: "",
        endDate: "",
      });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Cập nhật khuyến mãi thành công!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          "Lỗi khi cập nhật khuyến mãi: " +
          (error.data?.message || error.message),
      });
    }
  };

  const handleDeletePromotion = async () => {
    try {
      await deletePromotion(promotionToDelete).unwrap();
      setOpenDeleteDialog(false);
      setPromotionToDelete(null);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Xóa khuyến mãi thành công!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          "Lỗi khi xóa khuyến mãi: " + (error.data?.message || error.message),
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
          onClick={() => setOpenDialog(true)}
        >
          Thêm khuyến mãi
        </Button>
      </Box>

      <Box height={500} width={"100%"}>
        <DataGrid
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

      {/* Dialog thêm/sửa khuyến mãi */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editPromotion ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Mã khuyến mãi"
            value={newPromotion.code}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, code: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Mô tả"
            value={newPromotion.description}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
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
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenDialog(false)}>
            Hủy
          </Button>
          <Button
            onClick={editPromotion ? handleUpdatePromotion : handleAddPromotion}
            variant="contained"
          >
            {editPromotion ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác nhận xóa ?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khuyến mãi này không ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenDeleteDialog(false)}>
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
