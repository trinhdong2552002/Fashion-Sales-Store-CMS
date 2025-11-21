import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListRolesQuery } from "@/services/api/role";
import { useState } from "react";
import { Refresh } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useSnackbar } from "@/components/Snackbar";

const RolesManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    data: dataRole,
    isLoading: isLoadingRole,
    isError: isErrorRole,
    refetch: refetchRole,
  } = useListRolesQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const dataRowRoles = dataRole?.result?.items || [];
  const totalRows = dataRole?.result?.totalItems || 0;

  const columnsRoles = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên vai trò", width: 150 },
    { field: "description", headerName: "Mô tả vai trò", width: 200 },
  ];

  const handleRefresh = () => {
    refetchRole();
    showSnackbar("Danh sách vai trò đã được làm mới!", "info");
  };

  if (isErrorRole)
    return (
      <ErrorDisplay
        error={{
          message: "Không tải được danh sách vai trò.",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Vai trò</Typography>

      <Button
        sx={{ mb: 3, mt: 3 }}
        variant="outlined"
        startIcon={<Refresh />}
        onClick={handleRefresh}
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
          columns={columnsRoles}
          rows={dataRowRoles}
          loading={isLoadingRole}
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
    </DashboardLayoutWrapper>
  );
};

export default RolesManagement;
