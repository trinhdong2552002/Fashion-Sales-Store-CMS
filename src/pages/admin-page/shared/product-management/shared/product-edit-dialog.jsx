import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditDialog from "@/components/Dialog/Edit_Dialog";

const ProductEditDialog = ({
  open,
  onClose,
  onSubmit,
  product,
  setProduct,
  submitted,
  dataCategories,
  dataColors,
  dataSizes,
  dataImages,
}) => {
  return (
    <EditDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Cập nhật sản phẩm"
    >
      <TextField
        label="Tên sản phẩm"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        fullWidth
        sx={{ mt: 2 }}
        required
        error={submitted && !product.name}
        helperText={
          submitted && !product.name ? "name không được để trống" : ""
        }
      />

      <TextField
        multiline
        placeholder="Mô tả sản phẩm"
        value={product.description}
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
        fullWidth
        sx={{ mt: 2 }}
        required
        error={submitted && !product.description}
        helperText={
          submitted && !product.description
            ? "description không được để trống"
            : ""
        }
      />

      <FormControl fullWidth sx={{ mt: 2 }} required>
        <InputLabel>Danh mục</InputLabel>
        <Select
          value={product.categoryId}
          onChange={(e) =>
            setProduct({ ...product, categoryId: e.target.value })
          }
          label="Danh mục"
        >
          {dataCategories?.result?.items?.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2 }} required>
        <InputLabel>Hình ảnh sản phẩm</InputLabel>
        <Select
          multiple
          value={product.imageIds || []}
          onChange={(e) => setProduct({ ...product, imageIds: e.target.value })}
          label="Hình ảnh sản phẩm"
          renderValue={(selected) => (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selected.map((id) => {
                const image =
                  dataImages?.result?.items.find((img) => img.id === id) ||
                  product.images?.find((img) => img.id === id);
                return (
                  <img
                    key={id}
                    src={image?.imageUrl}
                    alt={image?.fileName}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 4,
                      border: "1px solid #ddd",
                    }}
                  />
                );
              })}
            </div>
          )}
        >
          {dataImages?.result?.items.map((image) => (
            <MenuItem key={image.id} value={image.id}>
              <img
                src={image.imageUrl}
                alt={image.fileName}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  marginRight: 10,
                }}
              />
              <span>{image.fileName}</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </EditDialog>
  );
};

export default ProductEditDialog;
