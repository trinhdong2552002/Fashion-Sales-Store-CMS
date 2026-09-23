import RestoreDialog from "@/components/Dialog/restore-dialog";

interface BranchRestoreDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const BranchRestoreDialog = ({
  open,
  onClose,
  onConfirm,
}: BranchRestoreDialogProps) => {
  return (
    <RestoreDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận khôi phục chi nhánh"
      description="Bạn có chắc chắn muốn khôi phục chi nhánh này không?"
    />
  );
};

export default BranchRestoreDialog;
