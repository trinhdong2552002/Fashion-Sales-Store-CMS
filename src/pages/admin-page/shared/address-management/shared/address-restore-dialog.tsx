import RestoreDialog from "@/components/dialog/restore-dialog";

interface AddressRestoreDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AddressRestoreDialog = ({
  open,
  onClose,
  onConfirm,
}: AddressRestoreDialogProps) => {
  return (
    <RestoreDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận khôi phục địa chỉ"
      description="Bạn có chắc chắn muốn khôi phục địa chỉ này?"
    />
  );
};

export default AddressRestoreDialog;
