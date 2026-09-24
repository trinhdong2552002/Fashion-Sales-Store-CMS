import DeleteDialog from "@/components/dialog/delete-dialog";

interface FileDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const FileDeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: FileDeleteDialogProps) => {
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
