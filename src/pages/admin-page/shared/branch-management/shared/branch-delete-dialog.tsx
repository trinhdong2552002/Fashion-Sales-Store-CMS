import DeleteDialog from "@/components/dialog/delete-dialog";

interface BranchDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const BranchDeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: BranchDeleteDialogProps) => {
  return (
    <DeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận xóa chi nhánh"
      description="Bạn có chắc chắn muốn xóa chi nhánh này? Bạn có thể khôi phục dữ liệu sau."
    />
  );
};

export default BranchDeleteDialog;
