import RestoreDialog from "@/components/Dialog/Restore_dialog";

const CategoryRestoreDialog = ({ open, onClose, onConfirm }) => {
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
