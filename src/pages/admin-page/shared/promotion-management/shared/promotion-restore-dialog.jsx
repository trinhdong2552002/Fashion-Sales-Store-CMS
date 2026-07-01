import RestoreDialog from "@/components/Dialog/Restore_dialog";

const PromotionRestoreDialog = ({ open, onClose, onConfirm }) => {
  return (
    <RestoreDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận khôi phục khuyến mãi"
      description="Bạn có chắc chắn muốn khôi phục khuyến mãi này không?"
    />
  );
};

export default PromotionRestoreDialog;
