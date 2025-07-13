import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Box,
  Snackbar,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListDistrictsQuery } from "@/services/api/district";
import { Refresh } from "@mui/icons-material";
import { useState } from "react";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useListDistrictsByProvinceQuery } from "@/services/api/province";
import { useListProvincesQuery } from "@/services/api/province";
import { skipToken } from "@reduxjs/toolkit/query";

const DistrictsManagement = () => {
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const {
    data: dataDistricts,
    isLoading: isLoadingDistricts,
    isError: isErrorDistricts,
    refetch: refetchDistricts,
  } = useListDistrictsQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: dataProvinces, isError: isErrorProvinces } =
    useListProvincesQuery(
      {
        page: 0,
        size: 100,
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const {
    data: dataDistrictsByProvince,
    isLoading: isLoadingDistrictsByProvince,
    isError: isErrorDistrictsByProvince,
    refetch: refetchDataDistrictsByProvince,
  } = useListDistrictsByProvinceQuery(
    selectedProvinceId
      ? {
          id: selectedProvinceId,
          page: paginationModel.page,
          size: paginationModel.pageSize,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const isLoading = selectedProvinceId
    ? isLoadingDistrictsByProvince
    : isLoadingDistricts;

  const dataRowDistricts =
    (selectedProvinceId
      ? dataDistrictsByProvince?.result?.items
      : dataDistricts?.result?.items) || [];

  const totalRows = selectedProvinceId
    ? dataDistrictsByProvince?.result?.totalItems
    : dataDistricts?.result?.totalItems || 0;

  const columnsDistrict = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên quận / huyện", width: 200 },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    if (selectedProvinceId) {
      refetchDataDistrictsByProvince();
    } else {
      refetchDistricts();
    }
    setSnackbar({
      open: true,
      message: "Danh sách quận / huyện đã được làm mới !",
      severity: "info",
    });
  };

  if (isErrorDistricts || isErrorDistrictsByProvince || isErrorProvinces) {
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được dữ liệu. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Quận / huyện
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Button
          variant="outlined"
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
          Làm mới
        </Button>

        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel>Chọn tỉnh / thành phố</InputLabel>
          <Select
            value={selectedProvinceId}
            label="Chọn tỉnh / thành phố"
            onChange={(e) => {
              setPaginationModel({
                page: 0,
                pageSize: paginationModel.pageSize,
              });
              setSelectedProvinceId(e.target.value);
            }}
          >
            {dataProvinces?.result?.items?.map((province) => (
              <MenuItem key={province.id} value={province.id}>
                {province.name}
              </MenuItem>
            ))}
            ‰
          </Select>
        </FormControl>
      </Box>

      <Box height={500} width={"100%"}>
        <DataGrid
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          columns={columnsDistrict}
          rows={dataRowDistricts}
          loading={isLoading}
          disableSelectionOnClick
          slotProps={{
            loadingOverlay: {
              variant: "linear-progress",
              noRowsVariant: "linear-progress",
            },
          }}
          localeText={{
            noRowsLabel: "Không có dữ liệu",
          }}
          pagination
          paginationMode="server"
          rowCount={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[20, 50, 100]}
        />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "right", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="standard"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayoutWrapper>
  );
};

export default DistrictsManagement;
