import { TextField } from "@mui/material";
import EditDialog from "@/components/Dialog/Edit_dialog";

const ProductVariantEditDialog = ({
  openEditDialog,
  onClose,
  handleUpdateProductVariant,
  editProductVariant,
  setEditProductVariant,
  //   submitted,
}) => {
  return (
    <EditDialog
      open={openEditDialog}
      onClose={onClose}
      onSubmit={handleUpdateProductVariant}
      title="Cập nhật biến thể sản phẩm"
    >
      <TextField
        label="Giá"
        type="number"
        value={editProductVariant.price ?? ""}
        fullWidth
        required
        sx={{ mt: 2 }}
        onChange={(e) =>
          setEditProductVariant({
            ...editProductVariant,
            price: e.target.value,
          })
        }
        /* Hiện tại backend chưa có validation khi người dùng ko nhập price và quantity */
        //   error={submitted && !editProductVariant.price}
        //   helperText={
        //     submitted && !editProductVariant.price
        //       ? "price không được để trống"
        //       : ""
        //   }
      />
      <TextField
        label="Số lượng"
        type="number"
        value={editProductVariant.quantity ?? ""}
        fullWidth
        required
        sx={{ mt: 2 }}
        onChange={(e) =>
          setEditProductVariant({
            ...editProductVariant,
            quantity: e.target.value,
          })
        }
        //   error={submitted && !editProductVariant.quantity}
        //   helperText={
        //     submitted && !editProductVariant.quantity
        //       ? "quantity không được để trống"
        //       : ""
        //   }
      />
    </EditDialog>
  );
};

export default ProductVariantEditDialog;
