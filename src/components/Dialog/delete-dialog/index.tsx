import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: DeleteDialogProps) => {
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
        <Box>
          <Typography
            textAlign={"center"}
            sx={{
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
        <Button variant="contained" color="error" onClick={onConfirm}>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
