import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Button, Box, IconButton, Chip } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListOrdersForAdminQuery } from "@/services/api/order";
import {
  Cancel,
  CheckCircle,
  Delete,
  HourglassEmpty,
  LocalShipping,
  Refresh,
  Settings,
  Visibility,
} from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";
import SnackbarComponent from "@/components/Snackbar";

const getOrderStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Chờ xử lý",
        color: "warning",
        icon: <HourglassEmpty fontSize="small" />,
      };
    case "PROCESSING":
      return {
        label: "Đang xử lý",
        color: "info",
        icon: <Settings fontSize="small" />,
      };
    case "SHIPPED":
      return {
        label: "Đã gửi",
        color: "primary",
        icon: <LocalShipping fontSize="small" />,
      };
    case "DELIVERED":
      return {
        label: "Đã giao",
        color: "success",
        icon: <CheckCircle fontSize="small" />,
      };
    case "CANCELLED":
      return {
        label: "Đã hủy",
        color: "error",
        icon: <Cancel fontSize="small" />,
      };
    default:
      return {
        label: status,
        color: "default",
        icon: null,
      };
  }
};

const OrdersManagement = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const {
    data: dataOrders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    refetch,
  } = useListOrdersForAdminQuery({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  const dataRowOrders = dataOrders?.result?.items || [];
  const totalRows = dataOrders?.result?.totalItems || 0;

  const columnsOrder = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "orderDate",
      headerName: "Ngày đặt hàng",
      width: 200,
    },
    { field: "totalPrice", headerName: "Tổng tiền", width: 200 },
    {
      field: "orderStatus",
      headerName: "Trạng thái đơn hàng",
      width: 200,
      renderCell: (params) => {
        const { label, color, icon } = getOrderStatusColor(params.value);
        return <Chip label={label} color={color} icon={icon} />;
      },
    },
    { field: "customerName", headerName: "Tên khách hàng", width: 200 },
    {
      field: "action",
      headerName: "Hành động",
      width: 200,
      renderCell: () => (
        <>
          <IconButton>
            <Visibility color="primary" />
          </IconButton>
          <IconButton color="error">
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
      severity: "info",
      message: "Danh sách đơn hàng đã được làm mới!",
    });
  };

  if (isErrorOrders)
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách đơn hàng. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Đơn hàng</Typography>

      <Button
        sx={{ mb: 3, mt: 3 }}
        variant="outlined"
        color="primary"
        onClick={handleRefresh}
        startIcon={<Refresh />}
      >
        Làm mới
      </Button>

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
          columns={columnsOrder}
          rows={dataRowOrders}
          loading={isLoadingOrders}
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

      <SnackbarComponent snackbar={snackbar} onClose={handleCloseSnackbar} />
    </DashboardLayoutWrapper>
  );
};

export default OrdersManagement;
