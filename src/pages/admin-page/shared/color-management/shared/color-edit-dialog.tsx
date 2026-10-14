import EditDialog from "@/components/dialog/edit-dialog";
import { TextField } from "@mui/material";

interface ColorEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newColor: { name: string };
  setNewColor: (newColor: { name: string }) => void;
  submitted: boolean;
}

const ColorEditDialog = ({
  open,
  onClose,
  onSubmit,
  newColor,
  setNewColor,
  submitted,
}: ColorEditDialogProps) => {
  return (
    <EditDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Cập nhật màu sắc"
    >
      <TextField
        label="Tên màu sắc"
        value={newColor.name}
        onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
        fullWidth
        sx={{ mt: 2 }}
        error={submitted && !newColor.name}
        helperText={
          submitted && !newColor.name ? "name không được để trống" : ""
        }
      />
    </EditDialog>
  );
};

export default ColorEditDialog;
