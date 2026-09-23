import RestoreDialog from "@/components/Dialog/restore-dialog";

interface ProductVariantRestoreDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ProductVariantRestoreDialog = ({
  open,
  onClose,
  onConfirm,
}: ProductVariantRestoreDialogProps) => (
  <RestoreDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận khôi phục biến thể sản phẩm"
    description="Bạn có chắc chắn muốn khôi phục biến thể sản phẩm này không?"
  />
);

export default ProductVariantRestoreDialog;
