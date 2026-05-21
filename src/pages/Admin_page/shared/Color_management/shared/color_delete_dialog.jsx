import DeleteDialog from "@/components/Dialog/Delete_dialog";

const ColorDeleteDialog = ({ open, onClose, onConfirm }) => {
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
