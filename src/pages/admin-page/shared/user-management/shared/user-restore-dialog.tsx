import RestoreDialog from "@/components/dialog/restore-dialog";

interface UserRestoreDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const UserRestoreDialog = ({
  open,
  onClose,
  onConfirm,
}: UserRestoreDialogProps) => {
  return (
    <RestoreDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận khôi phục người dùng"
      description="Bạn có chắc chắn muốn khôi phục người dùng này không? Người dùng sẽ có thể truy cập lại hệ thống sau khi được khôi phục."
    />
  );
};

export default UserRestoreDialog;
