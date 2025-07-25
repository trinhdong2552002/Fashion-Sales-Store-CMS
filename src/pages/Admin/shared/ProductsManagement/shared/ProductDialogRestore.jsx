import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

const ProductDialogRestore = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Xác nhận khôi phục ?</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn khôi phục sản phẩm này không ?
        </Typography>
      </DialogContent>
      <DialogActions sx={{p: 3}}>
        <Button color="error" variant="outlined" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="contained" color="success" onClick={onConfirm}>
          Khôi phục
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialogRestore;
