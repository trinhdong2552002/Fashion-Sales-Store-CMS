import { TextField } from "@mui/material";
import EditDialog from "@/components/Dialog/Edit_dialog";

export const ProductVariantEditDialog = ({
  openEditDialog,
  closeEditDialog,
  handleUpdateProductVariant,
  newProductVariant,
  setNewProductVariant,
  //   submitted,
}) => {
  return (
    <EditDialog
      open={openEditDialog}
      onClose={closeEditDialog}
      onSubmit={handleUpdateProductVariant}
      title="Cập nhật biến thể sản phẩm"
    >
      <TextField
        label="Giá"
        type="number"
        value={newProductVariant.price ?? ""}
        fullWidth
        required
        sx={{ mt: 2 }}
        onChange={(e) =>
          setNewProductVariant({
            ...newProductVariant,
            price: e.target.value,
          })
        }
        /* Hiện tại backend chưa có validation khi người dùng ko nhập price và quantity */
        //   error={submitted && !newProductVariant.price}
        //   helperText={
        //     submitted && !newProductVariant.price
        //       ? "price không được để trống"
        //       : ""
        //   }
      />
      <TextField
        label="Số lượng"
        type="number"
        value={newProductVariant.quantity ?? ""}
        fullWidth
        required
        sx={{ mt: 2 }}
        onChange={(e) =>
          setNewProductVariant({
            ...newProductVariant,
            quantity: e.target.value,
          })
        }
        //   error={submitted && !newProductVariant.quantity}
        //   helperText={
        //     submitted && !newProductVariant.quantity
        //       ? "quantity không được để trống"
        //       : ""
        //   }
      />
    </EditDialog>
  );
};
