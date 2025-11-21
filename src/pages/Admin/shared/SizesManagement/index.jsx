import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListSizesQuery } from "@/services/api/size";
import { Refresh } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useSnackbar } from "@/components/Snackbar";

const SizesManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    data: dataSize,
    isLoading: isLoadingSize,
    isError: isErrorSize,
    refetch: refetchSize,
  } = useListSizesQuery(
    {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const dataRowSizes = dataSize?.result?.items || [];
  const totalRows = dataSize?.result?.totalItems || 0;

  const columnsSize = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên kích thước", width: 200 },
  ];

  const handleRefresh = () => {
    refetchSize();
    showSnackbar("Danh sách kích thước đã được làm mới!", "info");
  };

  if (isErrorSize)
    return (
      <ErrorDisplay
        error={{
          message: "Không tải được danh sách kích thước.",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Kích thước</Typography>

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
          columns={columnsSize}
          rows={dataRowSizes}
          disableSelectionOnClick
          loading={isLoadingSize}
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

export default SizesManagement;
