import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const SeeDetailDialog = ({
  open,
  onClose,
  title,
  maxWidth = "md",
  children,
}) => {
  return (
    <Dialog open={open} maxWidth={maxWidth} fullWidth>
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
        <Button variant="outlined" onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SeeDetailDialog;
