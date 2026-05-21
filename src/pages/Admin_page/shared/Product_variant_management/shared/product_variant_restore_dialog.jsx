import RestoreDialog from "@/components/Dialog/Restore_dialog";

export const ProductVariantRestoreDialog = ({
  openRestoreDialog,
  closeRestoreDialog,
  handleRestoreProductVariant,
}) => (
  <RestoreDialog
    open={openRestoreDialog}
    onClose={closeRestoreDialog}
    onConfirm={handleRestoreProductVariant}
    title="Xác nhận khôi phục biến thể sản phẩm"
    description="Bạn có chắc chắn muốn khôi phục biến thể sản phẩm này không?"
  />
);
