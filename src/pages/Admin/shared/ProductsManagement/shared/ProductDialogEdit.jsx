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
import ProductFormControl from "./ProductFormControl";

const ProductDialogEdit = ({
  open,
  onClose,
  onSubmit,
  product,
  setProduct,
  variants,
  setVariants,
  submitted,
  categories,
}) => {
  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>Cập nhật sản phẩm</DialogTitle>
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
            value={product.categoryId || ""}
            onChange={(e) =>
              setProduct({ ...product, categoryId: e.target.value })
            }
            label="Danh mục"
          >
            {categories?.result?.items?.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ProductFormControl variants={variants} setVariants={setVariants} />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button color="error" variant="outlined" onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialogEdit;
