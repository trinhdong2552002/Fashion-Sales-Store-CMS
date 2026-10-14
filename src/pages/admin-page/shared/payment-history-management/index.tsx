import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/dashboard-layout";
import TableData from "@/components/table-data";
import { Info } from "@mui/icons-material";

const PaymentHistoryManagement = () => {
  const [paymentHistories, setPaymentHistories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newPaymentHistory, setNewPaymentHistory] = useState({
    order: "",
    paymentMethod: "",
    totalAmount: "",
    paymentStatus: "PAID",
    paymentTime: "",
    note: "",
  });
  const [editPaymentHistory, setEditPaymentHistory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [paymentHistoryToDelete, setPaymentHistoryToDelete] = useState(null);

  const columnsPaymentHistories = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "order",
      headerName: "Đơn hàng",
      width: 150,
      valueGetter: (params: any) => params.row.order?.id || "",
    },
    {
      field: "paymentMethod",
      headerName: "Phương thức thanh toán",
      width: 200,
    },
    { field: "totalAmount", headerName: "Tổng tiền", width: 120 },
    { field: "paymentStatus", headerName: "Trạng thái", width: 150 },
  ];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Quản lý lịch sử thanh toán
      </Typography>

      <Box
        mt={2}
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Info sx={{ fontSize: 48, mb: 2, color: "text.secondary" }} />
        <Typography variant="h6" color="text.primary">
          Đang trong quá trình phát triển.
        </Typography>
      </Box>

      {/* <TableData
        getRowId={(row: any) => row.id}
        rows={dataRowRoles}
        totalRows={totalRows}
        columnsData={columnsPaymentHistories}
        loading={isErrorRole}
        error={
          isErrorRole && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorRole} || Không tải được dữ liệu.
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
      /> */}
    </DashboardLayoutWrapper>
  );
};

export default PaymentHistoryManagement;
