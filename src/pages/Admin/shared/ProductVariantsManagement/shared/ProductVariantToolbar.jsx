import { Refresh } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Fragment } from "react";

export const ProductVariantToolbar = ({
  handleRefresh,
  selectedProductId,
  setSelectedProductId,
  activeProducts,
  paginationModel,
  setPaginationModel,
}) => {
  return (
    <Fragment>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          mb: 2,
          mt: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
          Làm mới
        </Button>

        <FormControl sx={{ minWidth: 500 }}>
          <InputLabel>Chọn sản phẩm</InputLabel>
          <Select
            value={selectedProductId}
            onChange={(e) => {
              setPaginationModel({
                page: 0,
                pageSize: paginationModel.pageSize,
              });
              setSelectedProductId(e.target.value);
            }}
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
    </Fragment>
  );
};
