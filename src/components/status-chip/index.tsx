import { Chip } from "@mui/material";

interface StatusChipProps {
  status: string;
}

const statusDisplay: Record<
  string,
  { label: string; color: any; variant: any }
> = {
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

const StatusChip = ({ status }: StatusChipProps) => {
  const { label, color, variant } = statusDisplay[status] || {
    label: "Không xác định",
    color: "default",
    variant: "outlined",
  };
  return <Chip label={label} color={color} variant={variant} />;
};

export default StatusChip;
