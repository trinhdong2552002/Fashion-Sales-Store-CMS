import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

const ProductDialogDelete = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Xác nhận xóa ?</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn xóa sản phẩm này không ?</Typography>
      </DialogContent>
      <DialogActions sx={{p: 3}}>
        <Button color="error" variant="outlined" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialogDelete;
