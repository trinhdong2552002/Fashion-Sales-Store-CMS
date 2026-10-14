import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface PreviewImageProps {
  previewImage: string | undefined | null;
  setPreviewImage: (image: string | null) => void;
}

export const PreviewImage = ({
  previewImage,
  setPreviewImage,
}: PreviewImageProps) => {
  return (
    <Dialog
      aria-hidden="false"
      open={!!previewImage}
      onClose={() => setPreviewImage(null)}
      fullWidth
    >
      <DialogTitle>Xem ảnh</DialogTitle>
      <DialogContent>
        <img
          src={previewImage || ""}
          alt="Preview"
          style={{ width: "100%", objectFit: "cover", borderRadius: 2 }}
        />
      </DialogContent>
    </Dialog>
  );
};
