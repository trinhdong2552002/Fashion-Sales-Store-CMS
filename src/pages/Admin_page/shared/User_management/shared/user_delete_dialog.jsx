import DeleteDialog from "@/components/Dialog/Delete_dialog";


const UserDeleteDialog = ({ open, onClose, onConfirm, title, description }) => {
  return (
    <DeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận xóa người dùng"
      description="Bạn có chắc chắn muốn xóa người dùng này? Bạn có thể khôi phục dữ liệu sau."
    />
  );
};

export default UserDeleteDialog;
