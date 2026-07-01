import RestoreDialog from "@/components/Dialog/Restore_dialog";

const BranchRestoreDialog = ({ open, onClose, onConfirm }) => {
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
