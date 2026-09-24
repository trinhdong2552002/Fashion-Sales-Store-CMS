import RestoreDialog from "@/components/dialog/restore-dialog";

interface PromotionRestoreDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PromotionRestoreDialog = ({
  open,
  onClose,
  onConfirm,
}: PromotionRestoreDialogProps) => {
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
