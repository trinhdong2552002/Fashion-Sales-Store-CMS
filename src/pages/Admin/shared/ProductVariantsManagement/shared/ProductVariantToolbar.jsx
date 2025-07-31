import { Refresh } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export const ProductVariantToolbar = ({
  handleRefresh,
  selectedProductId,
  setSelectedProductId,
  dataProducts,
  refetchProducts,
}) => {
  // Lọc sản phẩm trạng thái theo ACTIVE
  const activeProducts = dataProducts?.result?.items.filter(
    (product) => product.status === "ACTIVE"
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
      <Grid size={{ md: 3, sm: 12, xs: 12 }}>
        <Button
          variant="outlined"
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
          Làm mới
        </Button>
      </Grid>

      <Grid size={{ md: 9, sm: 12, xs: 12 }}>
        <Box
          sx={{
            display: "flex",
            mt: {
              sm: 2,
              xs: 2,
              md: 0,
            },
            justifyContent: {
              xs: "flex-start", // mobile
              sm: "flex-start", // tablet
              md: "flex-end", // desktop
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
              // Khi select component refetch ngay lập tức
              onOpen={() => refetchProducts()}
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
