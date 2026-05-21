import DeleteDialog from "@/components/Dialog/Delete_dialog";

const BranchDeleteDialog = ({ open, onClose, onConfirm }) => {
  return (
    <DeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận xóa chi nhánh"
      description="Bạn có chắc chắn muốn xóa chi nhánh này? Bạn có thể khôi phục dữ liệu sau."
    />
  );
};

export default BranchDeleteDialog;
