import { useState } from "react";
import {
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/dashboard-layout";
import { useListOrdersForAdminQuery } from "@/services/api/order";
import { Delete, Refresh, Visibility } from "@mui/icons-material";
import { useDeleteOrderByIdMutation } from "@/services/api/order";
import { useSnackbar } from "@/components/snackbar";
import TableData from "@/components/table-data";
import OrderStatusChip from "@/components/order-status-chip";

const OrderManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const {
    data: dataOrder,
    isLoading: isLoadingOrder,
    isError: isErrorOrder,
    error: errorOrder,
    refetch: refetchOrder,
  } = useListOrdersForAdminQuery({
    pageNo: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
  });

  const [deleteOrderById] = useDeleteOrderByIdMutation();

  const dataRowOrders = dataOrder?.result?.items || [];
  const totalRows = dataOrder?.result?.totalItems || 0;

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
      renderCell: (params: any) => {
        return <OrderStatusChip status={params.value} />;
      },
    },
    { field: "customerName", headerName: "Tên khách hàng", width: 200 },
    {
      field: "action",
      headerName: "Hành động",
      width: 200,
      renderCell: (params: any) => (
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

  const handleOpenDeleteDialog = (id: any) => {
    setSelectedOrderId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedOrderId(null);
    setOpenDeleteDialog(false);
  };

  const handleRefresh = () => {
    refetchOrder();
    showSnackbar("Danh sách đơn hàng đã được làm mới!", "success");
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteOrderById({ id: selectedOrderId }).unwrap();
    } catch (error: any) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
        return;
      }
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý đơn hàng</Typography>

      <Button
        sx={{ my: 3 }}
        variant="outlined"
        color="primary"
        onClick={handleRefresh}
        startIcon={<Refresh />}
      >
        Làm mới
      </Button>

      <TableData
        getRowId={(row: any) => row.id}
        rows={dataRowOrders}
        totalRows={totalRows}
        columnsData={columnsOrder}
        loading={isLoadingOrder}
        error={
          isErrorOrder && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {(errorOrder as any)?.data?.message ||
                  "Không tải được dữ liệu."}
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
      />

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
    </DashboardLayoutWrapper>
  );
};

export default OrderManagement;
