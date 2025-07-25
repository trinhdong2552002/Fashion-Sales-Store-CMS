import { Cancel, CheckCircle, HourglassEmpty, LocalShipping, Settings } from "@mui/icons-material";

export const statusDisplay = {
  ACTIVE: {
    label: "Đang hoạt động",
    color: "success",
    variant: "outlined",
  },
  INACTIVE: {
    label: "Ngừng hoạt động",
    color: "default",
    variant: "outlined",
  },
};

export const orderStatusDisplay = {
  PENDING: {
    label: "Chờ xử lý",
    color: "warning",
    icon: <HourglassEmpty fontSize="small" />,
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "info",
    icon: <Settings fontSize="small" />,
  },
  SHIPPED: {
    label: "Đã gửi",
    color: "primary",
    icon: <LocalShipping fontSize="small" />,
  },
  DELIVERED: {
    label: "Đã giao",
    color: "success",
    icon: <CheckCircle fontSize="small" />,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "error",
    icon: <Cancel fontSize="small" />,
  },
  default: {
    label: status,
    color: "default",
    icon: null,
  },
};
