import { DataGrid } from "@mui/x-data-grid";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListRolesQuery } from "@/services/api/role";
import { useState } from "react";
import { Refresh } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";

const RolesManagement = () => {
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
    data: dataRoles,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
    refetch,
  } = useListRolesQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const dataRowRoles = dataRoles?.result?.items || [];
  const totalRows = dataRoles?.result?.totalItems || 0;

  const columnsRoles = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên vai trò", width: 150 },
    { field: "description", headerName: "Mô tả vai trò", width: 200 },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Danh sách vai trò đã được làm mới!",
      severity: "info",
    });
  };

  if (isErrorRoles)
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách vai trò. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Vai trò
      </Typography>

      <Button
        sx={{ mb: 2 }}
        variant="outlined"
        startIcon={<Refresh />}
        onClick={handleRefresh}
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
          columns={columnsRoles}
          rows={dataRowRoles}
          loading={isLoadingRoles}
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
          sortingMode="server"
          filterMode="server"
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

export default RolesManagement;
