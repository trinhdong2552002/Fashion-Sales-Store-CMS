import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { useListColorsQuery } from "@/services/api/color";
import { useListSizesQuery } from "@/services/api/size";
import { useListImagesQuery } from "@/services/api/productImage";
import { Add, Delete } from "@mui/icons-material";

const ProductFormControl = ({ variants, setVariants }) => {
  const { data: dataColors, refetch: refetchColor } = useListColorsQuery(
    { page: 0, size: 100 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: dataSizes, refetch: refetchSize } = useListSizesQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: dataImages, refetch: refetchImage } = useListImagesQuery(
    { page: 0, size: 100, fileType: "PRODUCT_IMAGE" },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        price: "",
        quantity: "",
        colorId: "",
        sizeId: "",
        imageId: "",
      },
    ]);
    refetchColor();
    refetchSize();
    refetchImage();
  };

  const handleRemoveVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  return (
    <Box>
      {variants.map((variant, index) => (
        <Box
          key={index}
          sx={{
            mt: 3,
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => handleRemoveVariant(index)}
            sx={{ position: "absolute", top: 8, right: 8 }}
            color="error"
          >
            <Delete />
          </IconButton>
          <Typography variant="subtitle1" gutterBottom>
            Biến thể #{index + 1}
          </Typography>

          <TextField
            label="Giá"
            type="number"
            value={variant.price}
            onChange={(e) =>
              handleVariantChange(index, "price", e.target.value)
            }
            fullWidth
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="Số lượng"
            type="number"
            value={variant.quantity}
            onChange={(e) =>
              handleVariantChange(index, "quantity", e.target.value)
            }
            fullWidth
            sx={{ mt: 2 }}
            required
          />

          <FormControl fullWidth sx={{ mt: 2 }} required>
            <InputLabel>Màu sắc</InputLabel>
            <Select
              value={variant.colorId || ""}
              onChange={(e) =>
                handleVariantChange(index, "colorId", e.target.value)
              }
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
              value={variant.sizeId || ""}
              onChange={(e) =>
                handleVariantChange(index, "sizeId", e.target.value)
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
            <InputLabel>Hình ảnh</InputLabel>
            <Select
              value={variant.imageId || ""}
              onChange={(e) =>
                handleVariantChange(index, "imageId", e.target.value)
              }
              label="Hình ảnh"
            >
              {dataImages?.result?.items.map((image) => (
                <MenuItem key={image.id} value={image.id}>
                  <Box display="flex" alignItems="center">
                    <img
                      src={image.imageUrl}
                      alt={image.fileName}
                      style={{
                        width: 30,
                        height: 30,
                        objectFit: "cover",
                        marginRight: 8,
                      }}
                    />
                    {image.fileName}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ))}

      <Button
        onClick={handleAddVariant}
        variant="outlined"
        color="primary"
        startIcon={<Add />}
        sx={{ mt: 3 }}
      >
        Thêm biến thể
      </Button>
    </Box>
  );
};

export default ProductFormControl;
