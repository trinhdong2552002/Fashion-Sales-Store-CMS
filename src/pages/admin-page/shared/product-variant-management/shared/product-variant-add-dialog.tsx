import AddDialog from "@/components/dialog/add-dialog";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

interface ProductVariantAddDialogProps {
  openAddDialog: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitted: boolean;
  productVariant: any;
  setNewProductVariant: (value: any) => void;
  dataProducts: any;
  dataColors: any;
  dataSizes: any;
}

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
}: ProductVariantAddDialogProps) => {
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
            (p: any) => p.id === productVariant.productId,
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
          {dataColors?.result?.items.map((color: any) => (
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
          {dataSizes?.result?.items.map((size: any) => (
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
