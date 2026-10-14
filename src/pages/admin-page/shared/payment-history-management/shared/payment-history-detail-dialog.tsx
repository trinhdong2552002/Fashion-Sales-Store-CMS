import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import {
  Receipt,
  Payment,
  CalendarToday,
  CheckCircleOutline,
  AttachMoney,
  Star,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { PaymentHistoryItem } from "@/services/api/payment-history";
import PaymentStatusChip from "./payment-status-chip";

interface PaymentHistoryDetailDialogProps {
  open: boolean;
  onClose: () => void;
  item: PaymentHistoryItem | null;
}

const formatCurrency = (amount?: number) => {
  if (amount == null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const PaymentHistoryDetailDialog: React.FC<PaymentHistoryDetailDialogProps> = ({
  open,
  onClose,
  item,
}) => {
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          fontWeight: 700,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Receipt color="primary" />
        <Typography variant="h6" fontWeight={700}>
          Chi tiết lịch sử thanh toán #{item.id}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2.5,
            borderRadius: 2,
            backgroundColor: "background.default",
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            SỐ TIỀN THANH TOÁN
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            color="primary.main"
            sx={{ my: 0.5 }}
          >
            {formatCurrency(item.totalAmount)}
          </Typography>
          <Box display="flex" justifyContent="center" mt={1}>
            <PaymentStatusChip status={item.paymentStatus} size="medium" />
          </Box>
        </Paper>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Payment color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Phương thức thanh toán
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {item.paymentMethod || "Chưa xác định"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Star color={item.isPrimary ? "warning" : "disabled"} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Phân loại thanh toán
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {item.isPrimary ? "Thanh toán chính" : "Thanh toán phụ"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <CalendarToday color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Thời gian thanh toán
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {item.paymentTime
                    ? dayjs(item.paymentTime).format("DD/MM/YYYY HH:mm:ss")
                    : "--"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="contained" onClick={onClose} fullWidth>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentHistoryDetailDialog;
