import DeleteDialog from "@/components/dialog/delete-dialog";

interface ColorDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ColorDeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: ColorDeleteDialogProps) => {
  return (
    <DeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận xóa màu sắc"
      description="Bạn có chắc chắn muốn xóa màu sắc này? Hành động này có thể ảnh hưởng đến các sản phẩm đang sử dụng màu sắc này."
    />
  );
};

export default ColorDeleteDialog;
