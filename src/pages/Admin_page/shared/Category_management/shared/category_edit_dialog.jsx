import EditDialog from "@/components/Dialog/Edit_dialog";
import { TextField } from "@mui/material";

const CategoryEditDialog = ({
  open,
  onClose,
  onSubmit,
  newCategories,
  setNewCategories,
  submitted,
}) => {
  return (
    <EditDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Cập nhật danh mục"
    >
      <TextField
        required
        label="Tên danh mục"
        value={newCategories.name}
        onChange={(e) =>
          setNewCategories({ ...newCategories, name: e.target.value })
        }
        fullWidth
        sx={{ mt: 2 }}
        error={submitted && !newCategories.name}
        helperText={
          submitted && !newCategories.name ? "name không được để trống" : ""
        }
      />
      <TextField
        label="Mô tả danh mục"
        value={newCategories.description}
        onChange={(e) =>
          setNewCategories({
            ...newCategories,
            description: e.target.value,
          })
        }
        fullWidth
        sx={{ mt: 3 }}
      />
    </EditDialog>
  );
};

export default CategoryEditDialog;
