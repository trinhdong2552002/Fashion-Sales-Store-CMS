import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const ProductDialogAdd = ({
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
  // Lấy danh sách categories trạng thái "ACTIVE"
  const filterActiveCategories =
    dataCategories?.result?.items?.filter(
      (activeCategories) => activeCategories.status === "ACTIVE"
    ) || [];

  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>Thêm sản phẩm</DialogTitle>
      <DialogContent>
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
          label="Mô tả"
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

        <TextField
          type="number"
          label="Giá"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          fullWidth
          sx={{ mt: 2 }}
          required
          error={submitted && !product.price}
          helperText={
            submitted && !product.price ? "price không được để trống" : ""
          }
        />

        <TextField
          type="number"
          label="Số lượng sản phẩm"
          value={product.quantity}
          onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
          fullWidth
          sx={{ mt: 2 }}
          required
          error={submitted && !product.quantity}
          helperText={
            submitted && !product.quantity ? "quantity không được để trống" : ""
          }
        />

        <FormControl fullWidth sx={{ mt: 2 }} required>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={product.categoryId || ""}
            onChange={(e) =>
              setProduct({ ...product, categoryId: e.target.value })
            }
            label="Danh mục"
          >
            {filterActiveCategories.map((categories) => (
              <MenuItem key={categories.id} value={categories.id}>
                {categories.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }} required>
          <InputLabel>Màu sắc</InputLabel>
          <Select
            multiple
            value={product.colorIds || []}
        onChange={(e) => {
  console.log("Selected colorIds:", e.target.value);
  setProduct({ ...product, colorIds: e.target.value });
}}
            label="Màu sắc"
          >
            {dataColors?.result?.items.map((color) => (
              <MenuItem key={color.id} value={color.id}>
                {color.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }} required>
          <InputLabel>Kích thước</InputLabel>
          <Select
            multiple
            value={product.sizeIds || []}
            onChange={(e) =>
              setProduct({ ...product, sizeIds: e.target.value })
            }
            label="Kích thước"
          >
            {dataSizes?.result?.items.map((size) => (
              <MenuItem key={size.id} value={size.id}>
                {size.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ mt: 2 }} required>
          <InputLabel>Hình ảnh sản phẩm</InputLabel>
          <Select
            multiple
            value={product.imageIds || []}
            onChange={(e) =>
              setProduct({ ...product, imageIds: e.target.value })
            }
            label="Hình ảnh sản phẩm"
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {selected.map((id) => {
                  const image = dataImages?.result?.items.find(
                    (img) => img.id === id
                  );
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
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button color="error" variant="outlined" onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialogAdd;
