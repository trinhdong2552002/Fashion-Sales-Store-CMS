import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListProvincesQuery } from "@/services/api/province";
import { Refresh } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";

const ProvincesManagement = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const {
    data: dataProvinces,
    isLoading: isLoadingProvinces,
    isError: isErrorProvinces,
    refetch,
  } = useListProvincesQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const dataRowProvinces = dataProvinces?.result?.items || [];
  const totalRows = dataProvinces?.result?.totalItems || 0;

  const columnsProvince = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên tỉnh / thành phố", width: 200 },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Danh sách tỉnh / thành phố đã được làm mới !",
      severity: "info",
    });
  };

  if (isErrorProvinces)
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách tỉnh / thành phố. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý tỉnh / thành phố
      </Typography>
      <Button
        sx={{ mb: 2 }}
        variant="outlined"
        onClick={handleRefresh}
        startIcon={<Refresh />}
      >
        Làm mới
      </Button>

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
          columns={columnsProvince}
          rows={dataRowProvinces}
          disableSelectionOnClick
          loading={isLoadingProvinces}
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

export default ProvincesManagement;
