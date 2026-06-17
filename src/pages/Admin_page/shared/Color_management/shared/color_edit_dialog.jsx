import EditDialog from "@/components/Dialog/Edit_Dialog";
import { TextField } from "@mui/material";

const ColorEditDialog = ({
  open,
  onClose,
  onSubmit,
  newColor,
  setNewColor,
  submitted,
}) => {
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
