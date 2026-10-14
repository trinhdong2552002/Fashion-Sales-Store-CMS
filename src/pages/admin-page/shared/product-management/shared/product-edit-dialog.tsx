import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
} from "@mui/material";
import EditDialog from "@/components/dialog/edit-dialog";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";

interface ProductEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  product: any;
  setProduct: (product: any) => void;
  submitted: boolean;
  dataCategories: any;
  dataColors: any;
  dataSizes: any;
  dataImages: any;
}

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
}: ProductEditDialogProps) => {
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

      <Box mt={2}>
        <ReactQuill
          value={product.description}
          onChange={(value) => setProduct({ ...product, description: value })}
          className={submitted && !product.description ? "ql-error" : ""}
        />
        {submitted && !product.description && (
          <FormHelperText error sx={{ mx: "14px", mt: "3px" }}>
            description không được để trống
          </FormHelperText>
        )}
      </Box>

      <FormControl fullWidth sx={{ mt: 2 }} required>
        <InputLabel>Danh mục</InputLabel>
        <Select
          value={product.categoryId}
          onChange={(e) =>
            setProduct({ ...product, categoryId: e.target.value })
          }
          label="Danh mục"
        >
          {dataCategories?.result?.items?.map((category: any) => (
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
          renderValue={(selected: any) => (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selected.map((id: any) => {
                const image =
                  dataImages?.result?.items.find((img: any) => img.id === id) ||
                  product.images?.find((img: any) => img.id === id);
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
          {dataImages?.result?.items.map((image: any) => (
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
