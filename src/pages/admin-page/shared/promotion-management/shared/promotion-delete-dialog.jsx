import DeleteDialog from "@/components/Dialog/Delete_dialog";

const PromotionDeleteDialog = ({ open, onClose, onConfirm }) => {
  return (
    <DeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận xóa khuyến mãi"
      description="Bạn có chắc chắn muốn xóa khuyến mãi này không? Bạn có thể khôi phục dữ liệu sau."
    />
  );
};

export default PromotionDeleteDialog;
