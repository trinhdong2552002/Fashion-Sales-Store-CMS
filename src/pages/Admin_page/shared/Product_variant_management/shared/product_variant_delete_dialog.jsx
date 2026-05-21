import DeleteDialog from "@/components/Dialog/Delete_dialog";

export const ProductVariantDeleteDialog = ({
  openDeleteDialog,
  closeDeleteDialog,
  handleDeleteProductVariant,
}) => (
  <DeleteDialog
    open={openDeleteDialog}
    onClose={closeDeleteDialog}
    onConfirm={handleDeleteProductVariant}
    title="Xác nhận xóa biến thể sản phẩm"
    description="Bạn có chắc chắn muốn xóa biến thể sản phẩm này không?"
  />
);
