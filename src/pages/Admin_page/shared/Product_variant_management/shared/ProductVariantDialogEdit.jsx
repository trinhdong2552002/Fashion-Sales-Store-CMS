import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

export const ProductVariantDialogEdit = ({
  openEditDialog,
  closeEditDialog,
  handleUpdateProductVariant,
  newProductVariant,
  setNewProductVariant,
//   submitted,
}) => {
  return (
    <Dialog open={openEditDialog} fullWidth>
      <DialogTitle>Cập nhật biến thể sản phẩm</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions sx={{p: 3}}>
        <Button color="error" variant="outlined" onClick={closeEditDialog}>
          Hủy
        </Button>
        <Button onClick={handleUpdateProductVariant} variant="contained">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};
