import DeleteDialog from "@/components/dialog/delete-dialog";

const CategoryDeleteDialog = ({ open, onClose, onConfirm }) => {
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
