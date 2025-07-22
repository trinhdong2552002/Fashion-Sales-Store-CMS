import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";

export const PreviewImage = ({ previewImage, setPreviewImage }) => {
  return (
    <Dialog
      aria-hidden="false"
      open={previewImage}
      onClose={() => setPreviewImage(null)}
      fullWidth
    >
      <DialogTitle>Xem ảnh</DialogTitle>
      <DialogContent>
        <img
          src={previewImage}
          alt="Preview"
          style={{ width: "100%", objectFit: "cover", borderRadius: 2 }}
        />
      </DialogContent>
    </Dialog>
  );
};
