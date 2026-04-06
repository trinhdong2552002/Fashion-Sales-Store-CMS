import {
  Cancel,
  CheckCircle,
  HourglassEmpty,
  LocalShipping,
  Settings,
} from "@mui/icons-material";
import { Chip } from "@mui/material";

const orderStatusDisplay = {
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
    label: "Không xác định",
    color: "default",
    icon: null,
  },
};

const OrderStatusChip = ({ status }) => {
  const { label, color, icon } =
    orderStatusDisplay[status] || orderStatusDisplay.default;
  return <Chip label={label} color={color} icon={icon} />;
};

export default OrderStatusChip;
