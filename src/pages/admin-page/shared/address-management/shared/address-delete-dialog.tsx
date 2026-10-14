import DeleteDialog from "@/components/dialog/delete-dialog";

interface AddressDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AddressDeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: AddressDeleteDialogProps) => {
  return (
    <DeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận xóa địa chỉ"
      description="Bạn có chắc chắn muốn xóa địa chỉ này? Bạn có thể khôi phục dữ liệu sau."
    />
  );
};

export default AddressDeleteDialog;
