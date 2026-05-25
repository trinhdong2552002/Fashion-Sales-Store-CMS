import { Add, Refresh } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const ProductVariantToolbar = ({
  handleRefresh,
  onAddProductVariant,
  selectedProductId,
  setSelectedProductId,
  dataProducts,
  refetchProducts,
}) => {
  const activeProducts = dataProducts?.result?.items.filter(
    (product) => product.status === "ACTIVE",
  );
  return (
    <Grid
      container
      sx={{
        my: 2,
      }}
      display={"flex"}
      alignItems={"center"}
    >
      <Grid size={{ lg: 6, md: 12, sm: 12, xs: 12 }}>
        <Box display={"flex"}>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            startIcon={<Refresh />}
          >
            Làm mới
          </Button>

          <Button
            variant="contained"
            disabled={!selectedProductId}
            startIcon={<Add />}
            sx={{ ml: 2 }}
            onClick={onAddProductVariant}
          >
            Thêm biến thể
          </Button>
        </Box>
      </Grid>

      <Grid size={{ lg: 6, md: 12, sm: 12, xs: 12 }}>
        <Box
          sx={{
            display: "flex",
            my: {
              sm: 2,
              xs: 2,
              md: 2,
              lg: 0,
            },
            justifyContent: {
              xs: "flex-start",
              sm: "flex-start",
              md: "flex-start",
              lg: "flex-end",
            },
          }}
        >
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel>Chọn sản phẩm</InputLabel>
            <Select
              value={selectedProductId || ""}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
              }}
              onOpen={() => refetchProducts}
              label="Chọn sản phẩm"
            >
              {activeProducts?.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProductVariantToolbar;
