import { TextField, Button, Box } from "@mui/material";
import { Refresh, Add } from "@mui/icons-material";
import { Fragment } from "react";

interface ProductToolbarProps {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  onCreateProduct: () => void;
  onRefresh: () => void;
}

const ProductToolbar = ({
  searchValue,
  setSearchValue,
  onCreateProduct,
  onRefresh,
}: ProductToolbarProps) => {
  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  return (
    <Fragment>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        mt={1}
      >
        <TextField
          sx={{
            minWidth: {
              xs: "100%",
              md: 500,
            },
          }}
          variant="standard"
          value={searchValue}
          onChange={handleSearchChange}
          label="Tìm kiếm sản phẩm"
        />
      </Box>

      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          sm: "center",
          md: "center",
        }}
        flexDirection={{
          xs: "column",
          sm: "row",
          md: "row",
        }}
        sx={{
          mb: 3,
          mt: 3,
          gap: {
            xs: 2,
            md: 0,
          },
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={onRefresh}
          startIcon={<Refresh />}
        >
          Làm mới
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={onCreateProduct}
          startIcon={<Add />}
        >
          Thêm sản phẩm
        </Button>
      </Box>
    </Fragment>
  );
};

export default ProductToolbar;
