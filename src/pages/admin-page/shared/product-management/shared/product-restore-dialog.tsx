import RestoreDialog from "@/components/dialog/restore-dialog";

interface ProductRestoreDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ProductRestoreDialog = ({
  open,
  onClose,
  onConfirm,
}: ProductRestoreDialogProps) => (
  <RestoreDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận khôi phục sản phẩm"
    description="Bạn có chắc chắn muốn khôi phục sản phẩm này không? Sản phẩm sẽ hiển thị lại trên hệ thống sau khi được khôi phục."
  />
);

export default ProductRestoreDialog;
