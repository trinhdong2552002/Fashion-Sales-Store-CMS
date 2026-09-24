import DeleteDialog from "@/components/dialog/delete-dialog";

interface ProductVariantDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ProductVariantDeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: ProductVariantDeleteDialogProps) => (
  <DeleteDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận xóa biến thể sản phẩm"
    description="Bạn có chắc chắn muốn xóa biến thể sản phẩm này không? Bạn có thể khôi phục dữ liệu sau."
  />
);

export default ProductVariantDeleteDialog;
