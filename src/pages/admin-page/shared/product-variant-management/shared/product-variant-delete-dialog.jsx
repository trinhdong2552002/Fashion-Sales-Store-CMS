import DeleteDialog from "@/components/Dialog/Delete_dialog";

const ProductVariantDeleteDialog = ({ open, onClose, onConfirm }) => (
  <DeleteDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận xóa biến thể sản phẩm"
    description="Bạn có chắc chắn muốn xóa biến thể sản phẩm này không? Bạn có thể khôi phục dữ liệu sau."
  />
);

export default ProductVariantDeleteDialog;
