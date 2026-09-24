import RestoreDialog from "@/components/dialog/restore-dialog";

interface CategoryRestoreDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CategoryRestoreDialog = ({
  open,
  onClose,
  onConfirm,
}: CategoryRestoreDialogProps) => {
  return (
    <RestoreDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận khôi phục danh mục"
      description="Bạn có chắc chắn muốn khôi phục danh mục này?"
    />
  );
};

export default CategoryRestoreDialog;
