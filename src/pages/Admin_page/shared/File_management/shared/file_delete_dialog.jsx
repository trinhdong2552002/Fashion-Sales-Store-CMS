import DeleteDialog from "@/components/Dialog/Delete_dialog";

const FileDeleteDialog = ({ open, onClose, onConfirm }) => {
  return (
    <DeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận xóa file"
      description="Bạn có chắc chắn muốn xóa file này không? Hành động này không thể hoàn tác."
    />
  );
};

export default FileDeleteDialog;
