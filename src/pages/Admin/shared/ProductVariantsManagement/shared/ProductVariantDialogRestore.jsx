import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export const ProductVariantDialogRestore = ({
  openRestoreDialog,
  closeRestoreDialog,
  handleRestoreProductVariant,
}) => {
  return (
    <Dialog open={openRestoreDialog}>
      <DialogTitle>Xác nhận khôi phục ?</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn xóa sản phẩm này không?</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={closeRestoreDialog}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleRestoreProductVariant}
        >
          Khôi phục
        </Button>
      </DialogActions>
    </Dialog>
  );
};
