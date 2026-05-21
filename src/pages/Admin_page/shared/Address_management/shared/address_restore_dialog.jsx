import RestoreDialog from "@/components/Dialog/Restore_dialog";

const AddressRestoreDialog = ({ open, onClose, onConfirm }) => {
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
