import {
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { Search, Refresh, Add } from "@mui/icons-material";
import { Fragment, useState } from "react";

const ProductToolbar = ({ onSearch, onAddProduct, onRefresh }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <Fragment>
      <Box
        display="flex"
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <TextField
          sx={{ minWidth: 500 }}
          variant="standard"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          label="Tìm kiếm sản phẩm"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton aria-label="search" onClick={handleSearchSubmit}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3, mt: 3 }}
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
          onClick={onAddProduct}
          startIcon={<Add />}
        >
          Thêm sản phẩm
        </Button>
      </Grid>
    </Fragment>
  );
};

export default ProductToolbar;
