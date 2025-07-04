import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Box, Button, Snackbar, Alert } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";

import { useListWardsQuery } from "@/services/api/ward";
import { Refresh } from "@mui/icons-material";

const WardsManagement = () => {
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
    refetch,
  } = useListWardsQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const dataRowWards =
    dataWards?.result?.items?.map((item) => ({ ...item, id: item.code })) || [];
  const totalRows = dataWards?.result?.totalItems || 0;

  const columnsWards = [
    { field: "code", headerName: "Code", width: 150 },
    { field: "name", headerName: "Tên phường / xã", width: 200 },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Danh sách tỉnh/thành phố đã được làm mới !",
      severity: "info",
    });
  };

  if (isErrorWards) {
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách phường/xã. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý phường / xã
      </Typography>

      <Button
        variant="outlined"
        onClick={handleRefresh}
        startIcon={<Refresh />}
        sx={{ mb: 2 }}
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
          columns={columnsWards}
          rows={dataRowWards}
          loading={isLoadingWards}
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

export default WardsManagement;
