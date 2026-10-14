import DeleteDialog from "@/components/dialog/delete-dialog";

interface UserDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const UserDeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: UserDeleteDialogProps) => {
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
