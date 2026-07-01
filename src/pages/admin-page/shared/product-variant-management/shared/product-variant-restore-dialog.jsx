import RestoreDialog from "@/components/Dialog/Restore_dialog";

const ProductVariantRestoreDialog = ({ open, onClose, onConfirm }) => (
  <RestoreDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận khôi phục biến thể sản phẩm"
    description="Bạn có chắc chắn muốn khôi phục biến thể sản phẩm này không?"
  />
);

export default ProductVariantRestoreDialog;
