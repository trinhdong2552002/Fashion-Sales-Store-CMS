import { Chip } from "@mui/material";

const statusDisplay = {
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

const StatusChip = ({ status }) => {
  const { label, color, variant } = statusDisplay[status] || {
    label: "Không xác định",
    color: "default",
    variant: "outlined",
  };
  return <Chip label={label} color={color} variant={variant} />;
};

export default StatusChip;
