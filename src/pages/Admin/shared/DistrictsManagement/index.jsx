import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Box,
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
import { useListDistrictsByProvinceQuery } from "@/services/api/province";
import { useListProvincesQuery } from "@/services/api/province";
import { skipToken } from "@reduxjs/toolkit/query";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useSnackbar } from "@/components/Snackbar";

const DistrictsManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const {
    data: dataDistrict,
    isLoading: isLoadingDistrict,
    isError: isErrorDistrict,
    refetch: refetchDistrict,
  } = useListDistrictsQuery(
    {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: dataProvince, isError: isErrorProvince } =
    useListProvincesQuery(
      {
        pageNo: 1,
        pageSize: 100,
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
    : isLoadingDistrict;

  const dataRowDistricts =
    (selectedProvinceId
      ? dataDistrictsByProvince?.result?.items
      : dataDistrict?.result?.items) || [];

  const totalRows = selectedProvinceId
    ? dataDistrictsByProvince?.result?.totalItems
    : dataDistrict?.result?.totalItems || 0;

  const columnsDistrict = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên quận / huyện", width: 200 },
  ];

  const handleRefresh = () => {
    if (selectedProvinceId) {
      refetchDataDistrictsByProvince();
    } else {
      refetchDistrict();
    }
    showSnackbar("Danh sách quận/huyện đã được làm mới!", "info");
  };

  if (isErrorDistrict || isErrorDistrictsByProvince || isErrorProvince) {
    return (
      <ErrorDisplay
        error={{
          message: "Không tải được dữ liệu.",
        }}
      />
    );
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Quận / huyện</Typography>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3, mt: 3 }}
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
            {dataProvince?.result?.items?.map((province) => (
              <MenuItem key={province.id} value={province.id}>
                {province.name}
              </MenuItem>
            ))}
            ‰
          </Select>
        </FormControl>
      </Box>

      <Box height={600}>
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
    </DashboardLayoutWrapper>
  );
};

export default DistrictsManagement;
