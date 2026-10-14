import DeleteDialog from "@/components/dialog/delete-dialog";

interface CategoryDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CategoryDeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: CategoryDeleteDialogProps) => {
  return (
    <DeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận xoá danh mục"
      description="Bạn có chắc chắn muốn xoá danh mục này không? Bạn có thể khôi phục dữ liệu sau."
    />
  );
};

export default CategoryDeleteDialog;
