import DeleteDialog from "@/components/dialog/delete-dialog";

interface PromotionDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PromotionDeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: PromotionDeleteDialogProps) => {
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
