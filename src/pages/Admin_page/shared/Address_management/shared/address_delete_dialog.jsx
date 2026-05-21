import DeleteDialog from "@/components/Dialog/Delete_dialog";

const AddressDeleteDialog = ({ open, onClose, onConfirm }) => {
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
