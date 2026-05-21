import DeleteDialog from "@/components/Dialog/Delete_dialog";

const ProductDeleteDialog = ({ open, onClose, onConfirm }) => (
  <DeleteDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận xóa sản phẩm"
    description="Bạn có chắc chắn muốn xóa sản phẩm này không? Bạn có thể khôi phục dữ liệu sau."
  />
);

export default ProductDeleteDialog;
