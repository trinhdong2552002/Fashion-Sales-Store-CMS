import DeleteDialog from "@/components/dialog/delete-dialog";

interface ProductDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ProductDeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: ProductDeleteDialogProps) => (
  <DeleteDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận xóa sản phẩm"
    description="Bạn có chắc chắn muốn xóa sản phẩm này không? Bạn có thể khôi phục dữ liệu sau."
  />
);

export default ProductDeleteDialog;
