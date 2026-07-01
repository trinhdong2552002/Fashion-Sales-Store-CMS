import AddDialog from "@/components/Dialog/Add_dialog";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const ProductVariantAddDialog = ({
  openAddDialog,
  onClose,
  onSubmit,
  submitted,
  productVariant,
  setNewProductVariant,
  dataProducts,
  dataColors,
  dataSizes,
}) => {
  return (
    <AddDialog
      open={openAddDialog}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Thêm biến thể"
    >
      <TextField
        label="Tên sản phẩm"
        disabled
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        value={
          // Find the product name based on the selected productId
          dataProducts?.result?.items.find(
            (p) => p.id === productVariant.productId,
          )?.name || ""
        }
        fullWidth
        sx={{ mt: 2 }}
      />

      <FormControl fullWidth sx={{ mt: 2 }} required>
        <InputLabel>Màu sắc</InputLabel>
        <Select
          label="Màu sắc"
          value={productVariant.colorId || ""}
          onChange={(e) => {
            setNewProductVariant({
              ...productVariant,
              colorId: e.target.value,
            });
          }}
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
          label="Kích thước"
          value={productVariant.sizeId || ""}
          onChange={(e) =>
            setNewProductVariant({ ...productVariant, sizeId: e.target.value })
          }
        >
          {dataSizes?.result?.items.map((size) => (
            <MenuItem key={size.id} value={size.id}>
              {size.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Giá"
        type="number"
        value={productVariant.price || ""}
        fullWidth
        required
        sx={{ mt: 2 }}
        onChange={(e) =>
          setNewProductVariant({
            ...productVariant,
            price: e.target.value,
          })
        }
      />

      <TextField
        label="Số lượng"
        type="number"
        value={productVariant.quantity || ""}
        fullWidth
        required
        sx={{ mt: 2 }}
        onChange={(e) =>
          setNewProductVariant({
            ...productVariant,
            quantity: e.target.value,
          })
        }
      />
    </AddDialog>
  );
};

export default ProductVariantAddDialog;
