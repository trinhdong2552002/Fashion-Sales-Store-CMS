import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListSizesQuery } from "@/services/api/size";
import { Refresh } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";
import SnackbarComponent from "@/components/Snackbar";

const SizesManagement = () => {
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
    data: dataSizes,
    isLoading: isLoadingSizes,
    isError: isErrorSizes,
    refetch,
  } = useListSizesQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const dataRowSizes = dataSizes?.result?.items || [];
  const totalRows = dataSizes?.result?.totalItems || 0;

  const columnsSize = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên kích thước", width: 200 },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Danh sách kích thước đã được làm mới !",
      severity: "info",
    });
  };

  if (isErrorSizes)
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách kích thước. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Kích thước
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
          columns={columnsSize}
          rows={dataRowSizes}
          disableSelectionOnClick
          loading={isLoadingSizes}
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

      <SnackbarComponent snackbar={snackbar} onClose={handleCloseSnackbar} />
    </DashboardLayoutWrapper>
  );
};

export default SizesManagement;
