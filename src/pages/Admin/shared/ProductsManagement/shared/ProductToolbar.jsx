import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { Search, Refresh, Add } from "@mui/icons-material";
import { Fragment, useState } from "react";

const ProductToolbar = ({
  selectedStatus,
  onStatusChange,
  onSearch,
  onAddProduct,
  onRefresh,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleStatusChange = (e) => {
    onStatusChange(e.target.value);
  };

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
      <Grid
        container
        spacing={4}
        display="flex"
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 5 }}>
          <TextField
            fullWidth
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
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              label="Trạng thái"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

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
