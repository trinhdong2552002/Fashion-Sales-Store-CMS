import { useState } from "react";
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
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/Dashboard_layout";
import {
  useGetAllPromotionsByAdminQuery,
  useAddPromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useRestorePromotionMutation,
} from "@/services/api/promotion";
import { Add, Delete, Edit, Refresh, Restore } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useSnackbar } from "@/components/Snackbar";
import StatusChip from "@/components/Status_chip";
import TableData from "@/components/Table_data";
import PromotionAddDialog from "./shared/promotion_add_dialog";
import PromotionEditDialog from "./shared/promotion_edit_dialog";
import PromotionDeleteDialog from "./shared/promotion_delete_dialog";
import PromotionRestoreDialog from "./shared/promotion_restore_dialog";

const PromotionManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
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
    error: errorPromotion,
    refetch: refetchPromotion,
  } = useGetAllPromotionsByAdminQuery(
    {
      page: paginationModel.page + 0,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    },
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
        return <StatusChip status={params.value} />;
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
        promotionId: selectedPromotionId,
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
      await deletePromotion({ promotionId: selectedPromotionId }).unwrap();
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
      await restorePromotion({ promotionId: selectedPromotionId }).unwrap();
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

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý khuyến mãi</Typography>

      <Box
        sx={{ my: 3, gap: { xs: 2, md: 0 } }}
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

      <TableData
        rows={dataRowPromotions}
        totalRows={totalRows}
        columnsData={columnsPromotion}
        loading={isLoadingPromotion}
        error={
          isErrorPromotion && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorPromotion} || Không tải được dữ liệu.
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
      />

      <PromotionAddDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddPromotion}
        newPromotion={newPromotion}
        setNewPromotion={setNewPromotion}
        submitted={submitted}
      />

      <PromotionEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        handleSubmit={handleUpdatePromotion}
        newPromotion={newPromotion}
        setNewPromotion={setNewPromotion}
        submitted={submitted}
      />

      <PromotionDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeletePromotion}
      />

      <PromotionRestoreDialog
        open={openRestoreDialog}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleRestorePromotion}
      />
    </DashboardLayoutWrapper>
  );
};

export default PromotionManagement;
