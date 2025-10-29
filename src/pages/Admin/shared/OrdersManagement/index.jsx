import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListOrdersForAdminQuery } from "@/services/api/order";
import { Delete, Refresh, Visibility } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";
import SnackbarComponent from "@/components/Snackbar";
import { orderStatusDisplay } from "/src/constants/badgeStatus";
import { useDeleteOrderByIdMutation } from "@/services/api/order";

const OrdersManagement = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
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
    pageNo: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
  });

  const [deleteOrderById] = useDeleteOrderByIdMutation();

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
        const status = params.value;
        const { label, color, icon } =
          orderStatusDisplay[status] || orderStatusDisplay.default;
        return <Chip label={label} color={color} icon={icon} />;
      },
    },
    { field: "customerName", headerName: "Tên khách hàng", width: 200 },
    {
      field: "action",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton>
            <Visibility color="primary" />
          </IconButton>
          <IconButton onClick={() => handleOpenDeleteDialog(params.row.id)}>
            <Delete color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  const handleOpenDeleteDialog = (id) => {
    setSelectedOrderId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedOrderId(null);
    setOpenDeleteDialog(false);
  };

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

  const handleDeleteOrder = async () => {
    try {
      await deleteOrderById({ id: selectedOrderId }).unwrap();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  if (isErrorOrders)
    return (
      <ErrorDisplay
        error={{
          message: "Không tải được danh sách đơn hàng.",
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

      <Dialog open={openDeleteDialog}>
        <DialogTitle>Xác nhận xoá ?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xoá đơn hàng này không ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={handleCloseDeleteDialog}
          >
            Huỷ
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteOrder}>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarComponent snackbar={snackbar} onClose={handleCloseSnackbar} />
    </DashboardLayoutWrapper>
  );
};

export default OrdersManagement;
