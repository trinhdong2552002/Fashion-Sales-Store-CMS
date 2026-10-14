import React from "react";
import {
  Card,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  ButtonGroup,
} from "@mui/material";
import { Refresh, FilterAlt, RestartAlt } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { PaymentStatus } from "@/services/api/payment-history";

interface PaymentHistoryToolbarProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  paymentStatus: PaymentStatus | "";
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
  onPaymentStatusChange: (status: PaymentStatus | "") => void;
  onRefresh: () => void;
  onReset: () => void;
  onQuickDateFilter: (type: number | "month" | "year" | "all") => void;
}

const PaymentHistoryToolbar: React.FC<PaymentHistoryToolbarProps> = ({
  startDate,
  endDate,
  paymentStatus,
  onStartDateChange,
  onEndDateChange,
  onPaymentStatusChange,
  onRefresh,
  onReset,
  onQuickDateFilter,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DatePicker
              label="Từ ngày"
              value={startDate}
              onChange={onStartDateChange}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DatePicker
              label="Đến ngày"
              value={endDate}
              onChange={onEndDateChange}
              format="DD/MM/YYYY"
              minDate={startDate || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="payment-status-filter-label">
                Trạng thái thanh toán
              </InputLabel>
              <Select
                labelId="payment-status-filter-label"
                value={paymentStatus}
                label="Trạng thái thanh toán"
                onChange={(e) =>
                  onPaymentStatusChange(e.target.value as PaymentStatus | "")
                }
              >
                <MenuItem value="">Tất cả trạng thái</MenuItem>
                <MenuItem value="PAID">Đã thanh toán (PAID)</MenuItem>
                <MenuItem value="PENDING">Chờ thanh toán (PENDING)</MenuItem>
                <MenuItem value="REFUNDED">Đã hoàn tiền (REFUNDED)</MenuItem>
                <MenuItem value="CANCELED">Đã hủy (CANCELED)</MenuItem>
                <MenuItem value="FAILED">Thất bại (FAILED)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box display="flex" gap={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                size="medium"
                startIcon={<RestartAlt />}
                onClick={onReset}
              >
                Đặt lại
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                startIcon={<Refresh />}
                onClick={onRefresh}
              >
                Làm mới
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
              pt={0.5}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <FilterAlt fontSize="small" color="action" />
                <Box component="span" sx={{ fontSize: "0.85rem", color: "text.secondary", fontWeight: 500 }}>
                  Lọc nhanh:
                </Box>
                <ButtonGroup size="small" variant="outlined">
                  <Button onClick={() => onQuickDateFilter(7)}>7 ngày qua</Button>
                  <Button onClick={() => onQuickDateFilter(30)}>30 ngày qua</Button>
                  <Button onClick={() => onQuickDateFilter("month")}>Tháng này</Button>
                  <Button onClick={() => onQuickDateFilter("year")}>Năm nay</Button>
                  <Button onClick={() => onQuickDateFilter("all")}>Tất cả</Button>
                </ButtonGroup>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </LocalizationProvider>
  );
};

export default PaymentHistoryToolbar;
