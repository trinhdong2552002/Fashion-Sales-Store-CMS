import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export const ProductVariantDialogDelete = ({
  openDeleteDialog,
  closeDeleteDialog,
  handleDeleteProductVariant,
}) => {
  return (
    <Dialog open={openDeleteDialog}>
      <DialogTitle>Xác nhận xóa ?</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn xóa sản phẩm này không?</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={closeDeleteDialog}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteProductVariant}
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};
