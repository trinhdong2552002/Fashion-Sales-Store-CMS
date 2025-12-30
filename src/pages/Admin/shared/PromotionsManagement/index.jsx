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
  IconButton,
  Box,
  Chip,
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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { statusDisplay } from "/src/constants/badgeStatus";
import { useSnackbar } from "@/components/Snackbar";

const PromotionsManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newPromotion, setNewPromotion] = useState({
    code: "",
    description: "",
    discountPercent: "",
    startDate: dayjs(),
    endDate: dayjs(),
  });

  const {
    data: dataPromotion,
    isLoading: isLoadingPromotion,
    isError: isErrorPromotion,
    refetch: refetchPromotion,
  } = useListPromotionsQuery(
    {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [addPromotion] = useAddPromotionMutation();
  const [updatePromotion] = useUpdatePromotionMutation();
  const [deletePromotion] = useDeletePromotionMutation();
  const [restorePromotion] = useRestorePromotionMutation();

  const dataRowPromotions = dataPromotion?.result?.items || [];
  const totalRows = dataPromotion?.result?.totalItems || 0;

  const columnsPromotion = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "code", headerName: "Mã khuyến mãi", width: 200 },
    {
      field: "description",
      headerName: "Mô tả",
      width: 300,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.description || "--"}
        </div>
      ),
    },
    {
      field: "discountPercent",
      headerName: "Giảm giá",
      width: 150,
      renderCell: (params) => (
        <div>
          {params.row.discountPercent}
          {"%"}
        </div>
      ),
    },
    {
      field: "startDate",
      headerName: "Ngày bắt đầu",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.startDate
            ? new Date(params.row.startDate).toLocaleDateString("vi-VN")
            : "N/A"}
        </div>
      ),
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.endDate
            ? new Date(params.row.endDate).toLocaleDateString("vi-VN")
            : "N/A"}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 200,
      renderCell: (params) => {
        const display = statusDisplay[params.value] || {
          label: "Không rõ",
          color: "default",
        };
        return (
          <Chip
            label={display.label}
            color={display.color}
            variant={display.variant}
          />
        );
      },
    },
    {
      field: "createdBy",
      headerName: "Người tạo",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.createdBy || "--"}
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.createdAt
            ? new Date(params.row.createdAt).toLocaleDateString("vi-VN")
            : "N/A"}
        </div>
      ),
    },
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
    refetchPromotion();
    showSnackbar("Danh sách khuyến mãi đã được làm mới!", "info");
  };

  const handleAddPromotion = async () => {
    setSubmitted(true);

    try {
      await addPromotion({
        ...newPromotion,
        discountPercent: parseFloat(newPromotion.discountPercent),
        startDate: newPromotion.startDate.format("YYYY-MM-DD"),
        endDate: newPromotion.endDate.format("YYYY-MM-DD"),
      }).unwrap();
      showSnackbar("Thêm khuyến mãi thành công!", "success");
      setNewPromotion({
        code: "",
        description: "",
        discountPercent: "",
        startDate: dayjs(),
        endDate: dayjs(),
      });
      setOpenAddDialog(false);
      setSubmitted(false);
      refetchPromotion();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleEditPromotion = (id) => {
    const promotionToEdit = dataRowPromotions.find((item) => item.id === id);

    if (promotionToEdit) {
      setNewPromotion({
        code: promotionToEdit.code,
        description: promotionToEdit.description || "",
        discountPercent: promotionToEdit.discountPercent,
        startDate: dayjs(promotionToEdit.startDate),
        endDate: dayjs(promotionToEdit.endDate),
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
        discountPercent: parseFloat(newPromotion.discountPercent),
        startDate: newPromotion.startDate.format("YYYY-MM-DD"),
        endDate: newPromotion.endDate.format("YYYY-MM-DD"),
      }).unwrap();
      showSnackbar("Cập nhật khuyến mãi thành công!", "success");
      setNewPromotion({
        code: "",
        description: "",
        discountPercent: "",
        startDate: dayjs(),
        endDate: dayjs(),
      });
      setSelectedPromotionId(null);
      setOpenEditDialog(false);
      setSubmitted(false);
      refetchPromotion();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleDeletePromotion = async () => {
    try {
      await deletePromotion({ id: selectedPromotionId }).unwrap();
      showSnackbar("Xóa khuyến mãi thành công!", "success");
      setOpenDeleteDialog(false);
      setSelectedPromotionId(null);
      refetchPromotion();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleRestorePromotion = async () => {
    try {
      await restorePromotion({ id: selectedPromotionId }).unwrap();
      showSnackbar("Khôi phục khuyến mãi thành công!", "success");
      setOpenRestoreDialog(false);
      setSelectedPromotionId(null);
      refetchPromotion();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  if (isErrorPromotion)
    return (
      <ErrorDisplay
        error={{
          message: "Không tải được danh sách khuyến mãi.",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Khuyến mãi</Typography>

      <Box
        sx={{ mb: 3, mt: 3, gap: { xs: 2, md: 0 } }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={{
          xs: "stretch",
          sm: "center",
          md: "center",
        }}
        flexDirection={{
          xs: "column",
          sm: "row",
          md: "row",
        }}
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
              startDate: dayjs(),
              endDate: dayjs(),
            });
          }}
        >
          Thêm khuyến mãi
        </Button>
      </Box>

      <Box height={600}>
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
          loading={isLoadingPromotion}
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

      {/* Add promotion dialog */}
      <Dialog open={openAddDialog} maxWidth="md" fullWidth>
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
              submitted && !newPromotion.code
                ? "Mã khuyến mãi không được để trống"
                : ""
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
                ? "Mô tả không được để trống"
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
                ? "Phần trăm giảm giá không được để trống"
                : ""
            }
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              display={"flex"}
              gap={2}
              alignItems={"center"}
              justifyContent={"space-between"}
              sx={{ mt: 2 }}
            >
              <DatePicker
                label="Ngày bắt đầu"
                value={newPromotion.startDate}
                onChange={(value) =>
                  setNewPromotion({
                    ...newPromotion,
                    startDate: value || dayjs(),
                  })
                }
                sx={{ flex: 1 }}
              />

              <DatePicker
                label="Ngày kết thúc"
                value={newPromotion.endDate}
                onChange={(value) =>
                  setNewPromotion({
                    ...newPromotion,
                    endDate: value || dayjs(),
                  })
                }
                sx={{ flex: 1 }}
                minDate={newPromotion.startDate}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => setOpenAddDialog(false)}
          >
            Hủy
          </Button>
          <Button onClick={handleAddPromotion} variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit promotion dialog */}
      <Dialog open={openEditDialog} maxWidth="md" fullWidth>
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
              submitted && !newPromotion.code
                ? "Mã khuyến mãi không được để trống"
                : ""
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
                ? "Mô tả không được để trống"
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
                ? "Phần trăm giảm giá không được để trống"
                : ""
            }
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              display={"flex"}
              gap={2}
              alignItems={"center"}
              justifyContent={"space-between"}
              sx={{ mt: 2 }}
            >
              <DatePicker
                label="Ngày bắt đầu"
                value={newPromotion.startDate}
                onChange={(value) =>
                  setNewPromotion({
                    ...newPromotion,
                    startDate: value || dayjs(),
                  })
                }
                sx={{ flex: 1 }}
              />

              <DatePicker
                label="Ngày kết thúc"
                value={newPromotion.endDate}
                onChange={(value) =>
                  setNewPromotion({
                    ...newPromotion,
                    endDate: value || dayjs(),
                  })
                }
                sx={{ flex: 1 }}
                minDate={newPromotion.startDate}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => setOpenEditDialog(false)}
          >
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
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={handleCloseDeleteDialog}
          >
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
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={handleCloseRestoreDialog}
          >
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
    </DashboardLayoutWrapper>
  );
};

export default PromotionsManagement;
