import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListProvincesQuery } from "@/services/api/province";
import { Refresh } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useSnackbar } from "@/components/Snackbar";

const ProvincesManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    data: dataProvince,
    isLoading: isLoadingProvince,
    isError: isErrorProvince,
    refetch: refetchProvince,
  } = useListProvincesQuery(
    {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const dataRowProvinces = dataProvince?.result?.items || [];
  const totalRows = dataProvince?.result?.totalItems || 0;

  const columnsProvince = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên tỉnh / thành phố", width: 200 },
  ];

  const handleRefresh = () => {
    refetchProvince();
    showSnackbar("Danh sách tỉnh/thành phố đã được làm mới!", "info");
  };

  if (isErrorProvince)
    return (
      <ErrorDisplay
        error={{
          message: "Không tải được danh sách tỉnh / thành phố.",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Tỉnh / thành phố</Typography>
      <Button
        sx={{ mb: 3, mt: 3 }}
        variant="outlined"
        onClick={handleRefresh}
        startIcon={<Refresh />}
      >
        Làm mới
      </Button>

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
          columns={columnsProvince}
          rows={dataRowProvinces}
          disableSelectionOnClick
          loading={isLoadingProvince}
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
          pageSizeOptions={[10, 15, 20]}
        />
      </Box>
    </DashboardLayoutWrapper>
  );
};

export default ProvincesManagement;
