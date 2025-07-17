import { useState } from "react";
import {
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Refresh } from "@mui/icons-material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListWardsQuery } from "@/services/api/ward";
import {
  useListDistrictsQuery,
  useListWardsByDistrictQuery,
} from "@/services/api/district";
import { skipToken } from "@reduxjs/toolkit/query";
import ErrorDisplay from "@/components/ErrorDisplay";
import SnackbarComponent from "@/components/Snackbar";

const WardsManagement = () => {
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
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
    data: dataWards,
    isLoading: isLoadingWards,
    isError: isErrorWards,
    refetch: refetchDataWards,
  } = useListWardsQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: dataDistricts, isError: isErrorDistricts } =
    useListDistrictsQuery(
      { page: 0, size: 1000 },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const {
    data: dataWardsByDistrict,
    isLoading: isLoadingWardsByDistrict,
    isError: isErrorWardsByDistrict,
    refetch: refetchDataWardsByDistrict,
  } = useListWardsByDistrictQuery(
    selectedDistrictId
      ? {
          id: selectedDistrictId,
          page: paginationModel.page,
          size: paginationModel.pageSize,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const isLoading = selectedDistrictId
    ? isLoadingWardsByDistrict
    : isLoadingWards;

  const dataRowWards =
    (selectedDistrictId
      ? dataWardsByDistrict?.result?.items
      : dataWards?.result?.items) || [];

  const rows = dataRowWards.map((item) => ({
    ...item,
    id: item.code,
  }));

  const totalRows = selectedDistrictId
    ? dataWardsByDistrict?.result?.totalItems
    : dataWards?.result?.totalItems || 0;

  const columnsWards = [
    { field: "code", headerName: "Code", width: 150 },
    { field: "name", headerName: "Tên phường / xã", width: 200 },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    if (selectedDistrictId) {
      refetchDataWardsByDistrict();
    } else {
      refetchDataWards();
    }
    setSnackbar({
      open: true,
      message: "Danh sách phường / xã đã được làm mới!",
      severity: "info",
    });
  };

  if (isErrorWards || isErrorWardsByDistrict || isErrorDistricts) {
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được dữ liệu. Vui lòng kiểm tra kết nối của bạn và thử lại!",
        }}
      />
    );
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Phường / xã</Typography>

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
          <InputLabel>Chọn quận / huyện</InputLabel>
          <Select
            value={selectedDistrictId}
            label="Chọn quận / huyện"
            onChange={(e) => {
              setPaginationModel({
                page: 0,
                pageSize: paginationModel.pageSize,
              });
              setSelectedDistrictId(e.target.value);
            }}
          >
            {dataDistricts?.result?.items?.map((district) => (
              <MenuItem key={district.id} value={district.id}>
                {district.name}
              </MenuItem>
            ))}
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
          columns={columnsWards}
          rows={rows}
          loading={isLoading}
          disableSelectionOnClick
          slotProps={{
            loadingOverlay: {
              variant: "linear-progress",
              noRowsVariant: "linear-progress",
            },
          }}
          localeText={{ noRowsLabel: "Không có dữ liệu" }}
          pagination
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
          rowCount={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[20, 50, 100]}
        />
      </Box>

      <SnackbarComponent snackbar={snackbar} onClose={handleCloseSnackbar} />
    </DashboardLayoutWrapper>
  );
};

export default WardsManagement;
