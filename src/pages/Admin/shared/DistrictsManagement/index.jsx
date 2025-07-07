import { DataGrid } from "@mui/x-data-grid";
import { Typography, Box, Snackbar, Alert, Button } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListDistrictsQuery } from "@/services/api/district";
import { Refresh } from "@mui/icons-material";
import { useState } from "react";
import ErrorDisplay from "@/components/ErrorDisplay";

const DistrictsManagement = () => {
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
    refetch,
  } = useListDistrictsQuery({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  const columnsDistrict = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên quận / huyện", width: 200 },
  ];

  const dataRowDistricts = dataDistricts?.result?.items || [];
  const totalRows = dataDistricts?.result?.totalItems || 0;

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Danh sách quận / huyện đã được làm mới !",
      severity: "info",
    });
  };

  if (isErrorDistricts) {
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách quận / huyện. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý quận / huyện
      </Typography>

      <Box
        sx={{ mb: 2 }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Button
          variant="outlined"
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
          Làm mới
        </Button>
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
          loading={isLoadingDistricts}
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
