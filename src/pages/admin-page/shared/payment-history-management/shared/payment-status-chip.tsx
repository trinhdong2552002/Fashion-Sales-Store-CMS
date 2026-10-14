import React from "react";
import { Chip, ChipProps } from "@mui/material";
import {
  CheckCircle,
  HourglassEmpty,
  Autorenew,
  Cancel,
  ErrorOutline,
  HelpOutline,
} from "@mui/icons-material";
import { PaymentStatus } from "@/services/api/payment-history";

interface PaymentStatusChipProps {
  status: PaymentStatus | string;
  size?: ChipProps["size"];
}

const statusConfig: Record<
  string,
  {
    label: string;
    color: ChipProps["color"];
    icon: React.ReactElement;
  }
> = {
  PAID: {
    label: "Đã thanh toán",
    color: "success",
    icon: <CheckCircle fontSize="small" />,
  },
  PENDING: {
    label: "Chờ thanh toán",
    color: "warning",
    icon: <HourglassEmpty fontSize="small" />,
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    color: "info",
    icon: <Autorenew fontSize="small" />,
  },
  CANCELED: {
    label: "Đã hủy",
    color: "default",
    icon: <Cancel fontSize="small" />,
  },
  FAILED: {
    label: "Thất bại",
    color: "error",
    icon: <ErrorOutline fontSize="small" />,
  },
};

const PaymentStatusChip: React.FC<PaymentStatusChipProps> = ({
  status,
  size = "small",
}) => {
  const config = statusConfig[status] || {
    label: status || "Không xác định",
    color: "default" as ChipProps["color"],
    icon: <HelpOutline fontSize="small" />,
  };

  return (
    <Chip
      size={size}
      label={config.label}
      color={config.color}
      icon={config.icon}
      variant="filled"
      sx={{
        fontWeight: 600,
        px: 0.5,
      }}
    />
  );
};

export default PaymentStatusChip;
