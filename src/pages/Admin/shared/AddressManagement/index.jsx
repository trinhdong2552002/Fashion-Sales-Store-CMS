import { Fragment, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";

import { Delete, Refresh, Restore } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";
import {
  useListAddressForAdminQuery,
  useDeleteAddressMutation,
  useRestoreAddressMutation,
} from "@/services/api/address";

const AddressManagement = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedCategoriesId, setSelectedCategoriesId] = useState(null);
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
    data: dataAddress,
    isLoading: isLoadingAddress,
    isError: isErrorAddress,
    refetch,
  } = useListAddressForAdminQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [deleteAddress] = useDeleteAddressMutation();
  const [restoreAddress] = useRestoreAddressMutation();

  const dataRowAddresses = dataAddress?.result?.items || [];
  const totalRows = dataAddress?.result?.totalItems || 0;

  const columnsAddress = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "streetDetail", headerName: "Địa chỉ cụ thể", width: 200 },
    {
      field: "ward",
      headerName: "Phường / Xã",
      width: 200,
      renderCell: (params) => params.row?.ward?.name || "—",
    },
    {
      field: "district",
      headerName: "Quận / Huyện",
      width: 200,
      renderCell: (params) => params.row?.district?.name || "—",
    },
    {
      field: "province",
      headerName: "Tỉnh / Thành phố",
      width: 200,
      renderCell: (params) => params.row?.province?.name || "—",
    },
    { field: "isDefault", headerName: "Địa chỉ mặc định", width: 200 },
    { field: "status", headerName: "Trạng thái", width: 200 },
    {
      field: "action",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <Fragment>
          {params.row?.status === "INACTIVE" ? (
            <IconButton onClick={() => handleOpenRestoreDialog(params.row.id)}>
              <Restore color="success" />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleOpenDeleteDialog(params.row.id)}>
              <Delete color="error" />
            </IconButton>
          )}
        </Fragment>
      ),
    },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedCategoriesId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedCategoriesId(null);
    setOpenDeleteDialog(false);
  };

  const handleOpenRestoreDialog = (id) => {
    setSelectedCategoriesId(id);
    setOpenRestoreDialog(true);
  };

  const handleCloseRestoreDialog = () => {
    setSelectedCategoriesId(null);
    setOpenRestoreDialog(false);
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Danh sách phường / xã đã được làm mới !",
      severity: "info",
    });
  };

  const handleDeleteCategories = async () => {
    try {
      await deleteAddress({ id: selectedCategoriesId }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Xoá địa chỉ thành công!",
      });
      setOpenDeleteDialog(false);
      setSelectedCategoriesId(null);
      refetch();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  const handleRestoreCategories = async () => {
    try {
      await restoreAddress({ id: selectedCategoriesId }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Khôi phục địa chỉ thành công !",
      });
      setOpenRestoreDialog(false);
      setSelectedCategoriesId(null);
      refetch();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  if (isErrorAddress) {
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách địa chỉ. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý địa chỉ
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
          columns={columnsAddress}
          rows={dataRowAddresses}
          loading={isLoadingAddress}
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

      <Dialog open={openDeleteDialog}>
        <DialogTitle>Xác nhận xoá ?</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xoá địa chỉ này không ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseDeleteDialog}>
            Huỷ
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteCategories}
          >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRestoreDialog}>
        <DialogTitle>Xác nhận khôi phục ?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn khôi phục địa chỉ này không ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseRestoreDialog}>
            Huỷ
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleRestoreCategories}
          >
            Khôi phục
          </Button>
        </DialogActions>
      </Dialog>

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

export default AddressManagement;
