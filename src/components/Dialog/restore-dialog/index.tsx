import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const RestoreDialog = ({ open, onClose, onConfirm, title, description }) => {
  return (
    <Dialog open={open}>
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
      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              fontSize: {
                xs: 15,
                sm: 17,
                md: 19,
              },
            }}
          >
            {description}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
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

export default RestoreDialog;
