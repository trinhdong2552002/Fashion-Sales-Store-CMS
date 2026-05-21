import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const EditDialog = ({ open, onClose, onSubmit, title, children }) => {
  return (
    <Dialog fullWidth open={open}>
      <DialogTitle sx={{ py: 3 }}>
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: {
              xs: 22,
              sm: 24,
              md: 26,
            },
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button color="error" variant="outlined" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
