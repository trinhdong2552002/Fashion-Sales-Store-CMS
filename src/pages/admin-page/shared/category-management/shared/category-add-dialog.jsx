import AddDialog from "@/components/Dialog/Add_dialog";
import {
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
} from "@mui/material";

const CategoryAddDialog = ({
  open,
  onClose,
  onSubmit,
  newCategories,
  setNewCategories,
  dataImages,
  refreshImages,
  submitted,
}) => {
  return (
    <AddDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Thêm danh mục"
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

      <FormControl fullWidth sx={{ mt: 2 }} required>
        <InputLabel>Hình ảnh danh mục</InputLabel>
        <Select
          value={newCategories.imageUrl || ""}
          onChange={(e) => {
            const selectedImage = dataImages?.result?.items.find(
              (img) => img.imageUrl === e.target.value,
            );
            setNewCategories({
              ...newCategories,
              imageUrl: selectedImage?.imageUrl || "",
            });
          }}
          label="Hình ảnh danh mục"
          renderValue={(selected) => {
            const image = dataImages?.result?.items.find(
              (img) => img.imageUrl === selected,
            );
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img
                  src={image?.imageUrl}
                  alt={image?.fileName}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                  }}
                />
                <span>{image?.fileName}</span>
              </div>
            );
          }}
        >
          {dataImages?.result?.items.map((image) => (
            <MenuItem key={image.id} value={image.imageUrl}>
              <img
                src={image?.imageUrl}
                alt={image?.fileName}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  marginRight: 10,
                }}
              />
              <span>{image?.fileName}</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </AddDialog>
  );
};

export default CategoryAddDialog;
