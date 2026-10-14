import { useState, useMemo } from "react";
import {
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Card,
  Grid,
} from "@mui/material";
import {
  Visibility,
  Delete,
  Payment,
  AccountBalanceWallet,
  CheckCircle,
  HourglassEmpty,
  Star,
} from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import DashboardLayoutWrapper from "@/layouts/dashboard-layout";
import TableData from "@/components/table-data";
import DeleteDialog from "@/components/dialog/delete-dialog";
import { useSnackbar } from "@/components/snackbar";
import {
  useSearchPaymentHistoriesQuery,
  useDeletePaymentHistoryMutation,
  PaymentHistoryItem,
  PaymentStatus,
} from "@/services/api/payment-history";
import PaymentStatusChip from "./shared/payment-status-chip";
import PaymentHistoryToolbar from "./shared/payment-history-toolbar";
import PaymentHistoryDetailDialog from "./shared/payment-history-detail-dialog";

const formatCurrency = (amount?: number) => {
  if (amount == null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const PaymentHistoryManagement = () => {
  const { showSnackbar } = useSnackbar();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().subtract(30, "day").startOf("day"),
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf("day"));
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");

  const [selectedItem, setSelectedItem] = useState<PaymentHistoryItem | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Format dates for backend search query (ISO-8601 string)
  const formattedStartDate = startDate
    ? startDate.startOf("day").format("YYYY-MM-DDTHH:mm:ss")
    : dayjs().subtract(30, "day").startOf("day").format("YYYY-MM-DDTHH:mm:ss");

  const formattedEndDate = endDate
    ? endDate.endOf("day").format("YYYY-MM-DDTHH:mm:ss")
    : dayjs().endOf("day").format("YYYY-MM-DDTHH:mm:ss");

  const {
    data: dataPaymentHistories,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchPaymentHistoriesQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
      sort: ["paymentTime,desc"],
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      paymentStatus: paymentStatus || undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [deletePaymentHistory, { isLoading: isDeleting }] =
    useDeletePaymentHistoryMutation();

  const rows: PaymentHistoryItem[] =
    dataPaymentHistories?.result?.items || [];
  const totalRows = dataPaymentHistories?.result?.totalItems || 0;

  // Calculate quick stats from current dataset
  const stats = useMemo(() => {
    let totalPaidAmount = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let failedOrCanceledCount = 0;

    rows.forEach((item) => {
      if (item.paymentStatus === "PAID") {
        totalPaidAmount += item.totalAmount || 0;
        paidCount++;
      } else if (item.paymentStatus === "PENDING") {
        pendingCount++;
      } else if (
        item.paymentStatus === "FAILED" ||
        item.paymentStatus === "CANCELED"
      ) {
        failedOrCanceledCount++;
      }
    });

    return {
      totalPaidAmount,
      paidCount,
      pendingCount,
      failedOrCanceledCount,
    };
  }, [rows]);

  const handleRefresh = () => {
    refetch();
    showSnackbar("Danh sách lịch sử thanh toán đã được làm mới!", "info");
  };

  const handleResetFilters = () => {
    setStartDate(dayjs().subtract(30, "day").startOf("day"));
    setEndDate(dayjs().endOf("day"));
    setPaymentStatus("");
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    showSnackbar("Đã đặt lại bộ lọc!", "info");
  };

  const handleQuickDateFilter = (type: number | "month" | "year" | "all") => {
    if (type === "all") {
      setStartDate(dayjs("2020-01-01T00:00:00"));
      setEndDate(dayjs().endOf("day"));
    } else if (type === "year") {
      setStartDate(dayjs().startOf("year"));
      setEndDate(dayjs().endOf("year"));
    } else if (type === "month") {
      setStartDate(dayjs().startOf("month"));
      setEndDate(dayjs().endOf("month"));
    } else {
      setStartDate(dayjs().subtract(type, "day").startOf("day"));
      setEndDate(dayjs().endOf("day"));
    }
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleOpenDetail = (item: PaymentHistoryItem) => {
    setSelectedItem(item);
    setOpenDetailDialog(true);
  };

  const handleOpenDelete = (id: number) => {
    setSelectedDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    if (isDeleting) return;
    setSelectedDeleteId(null);
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;

    try {
      await deletePaymentHistory({ id: selectedDeleteId }).unwrap();
      showSnackbar("Xóa bản ghi lịch sử thanh toán thành công!", "success");
      handleCloseDelete();
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Không thể xóa bản ghi thanh toán!";
      showSnackbar(message, "error");
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      renderCell: (params: any) => (
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          #{params.value}
        </Typography>
      ),
    },
    {
      field: "paymentMethod",
      headerName: "Phương thức",
      width: 170,
      renderCell: (params: any) => (
        <Box display="flex" alignItems="center" gap={1} height="100%">
          <Payment fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={500}>
            {params.value || "--"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Số tiền",
      width: 160,
      renderCell: (params: any) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography
            variant="body2"
            fontWeight={700}
            color={
              params.row.paymentStatus === "PAID"
                ? "success.main"
                : "text.primary"
            }
          >
            {formatCurrency(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "isPrimary",
      headerName: "Phân loại",
      width: 150,
      renderCell: (params: any) => (
        <Box display="flex" alignItems="center" height="100%">
          {params.value ? (
            <Chip
              size="small"
              icon={<Star fontSize="small" />}
              label="Chính"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          ) : (
            <Chip
              size="small"
              label="Phụ"
              variant="outlined"
              sx={{ fontWeight: 500, color: "text.secondary" }}
            />
          )}
        </Box>
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Trạng thái",
      width: 180,
      renderCell: (params: any) => (
        <Box display="flex" alignItems="center" height="100%">
          <PaymentStatusChip status={params.value} />
        </Box>
      ),
    },
    {
      field: "paymentTime",
      headerName: "Thời gian",
      width: 190,
      renderCell: (params: any) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2" color="text.secondary">
            {params.value
              ? dayjs(params.value).format("DD/MM/YYYY HH:mm:ss")
              : "--"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 130,
      sortable: false,
      renderCell: (params: any) => (
        <Box display="flex" alignItems="center" gap={0.5} height="100%">
          <Tooltip title="Xem chi tiết">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenDetail(params.row)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa bản ghi">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleOpenDelete(params.row.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <DashboardLayoutWrapper>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Quản lý lịch sử thanh toán
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Theo dõi, tra cứu và quản lý các giao dịch thanh toán trong hệ thống
        </Typography>
      </Box>

      {/* KPI / Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "primary.light",
                color: "primary.contrastText",
                display: "flex",
              }}
            >
              <AccountBalanceWallet fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Tổng giao dịch hiển thị
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {totalRows}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "success.light",
                color: "success.contrastText",
                display: "flex",
              }}
            >
              <CheckCircle fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Doanh thu thanh toán ({stats.paidCount})
              </Typography>
              <Typography variant="h6" fontWeight={700} color="success.main">
                {formatCurrency(stats.totalPaidAmount)}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "warning.light",
                color: "warning.contrastText",
                display: "flex",
              }}
            >
              <HourglassEmpty fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Đang chờ xử lý
              </Typography>
              <Typography variant="h6" fontWeight={700} color="warning.main">
                {stats.pendingCount}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "error.light",
                color: "error.contrastText",
                display: "flex",
              }}
            >
              <Delete fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Hủy / Thất bại
              </Typography>
              <Typography variant="h6" fontWeight={700} color="error.main">
                {stats.failedOrCanceledCount}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Toolbar */}
      <PaymentHistoryToolbar
        startDate={startDate}
        endDate={endDate}
        paymentStatus={paymentStatus}
        onStartDateChange={(val) => {
          setStartDate(val);
          setPaginationModel((prev) => ({ ...prev, page: 0 }));
        }}
        onEndDateChange={(val) => {
          setEndDate(val);
          setPaginationModel((prev) => ({ ...prev, page: 0 }));
        }}
        onPaymentStatusChange={(val) => {
          setPaymentStatus(val);
          setPaginationModel((prev) => ({ ...prev, page: 0 }));
        }}
        onRefresh={handleRefresh}
        onReset={handleResetFilters}
        onQuickDateFilter={handleQuickDateFilter}
      />

      {/* Data Table */}
      <TableData
        getRowId={(row: any) => row.id}
        rows={rows}
        totalRows={totalRows}
        columnsData={columns}
        loading={isLoading || isFetching}
        error={
          isError && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {(error as any)?.data?.message ||
                  (error as any)?.message ||
                  "Không tải được dữ liệu lịch sử thanh toán."}
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50, 100]}
      />

      {/* Detail Dialog */}
      <PaymentHistoryDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        item={selectedItem}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa giao dịch"
        description={`Bạn có chắc chắn muốn xóa bản ghi lịch sử thanh toán #${selectedDeleteId}? Hành động này không thể hoàn tác.`}
      />
    </DashboardLayoutWrapper>
  );
};

export default PaymentHistoryManagement;
