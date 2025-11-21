import { Fragment, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { Delete, Refresh, Restore } from "@mui/icons-material";
import {
  useListAddressForAdminQuery,
  useDeleteAddressMutation,
  useRestoreAddressMutation,
} from "@/services/api/address";
import ErrorDisplay from "@/components/ErrorDisplay";
import { statusDisplay } from "/src/constants/badgeStatus";
import { useSnackbar } from "@/components/Snackbar";

const AddressManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedCategoriesId, setSelectedCategoriesId] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    data: dataAddress,
    isLoading: isLoadingAddress,
    isError: isErrorAddress,
    refetch: refetchAddress,
  } = useListAddressForAdminQuery(
    {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
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
    { field: "id", headerName: "ID", width: 150 },
    { field: "streetDetail", headerName: "Địa chỉ cụ thể", width: 200 },
    {
      field: "ward",
      headerName: "Phường / Xã",
      width: 200,
      renderCell: (params) => params.row?.ward?.name || "—-",
    },
    {
      field: "district",
      headerName: "Quận / Huyện",
      width: 200,
      renderCell: (params) => params.row?.district?.name || "—-",
    },
    {
      field: "province",
      headerName: "Tỉnh / Thành phố",
      width: 200,
      renderCell: (params) => params.row?.province?.name || "—-",
    },
    {
      field: "isDefault",
      headerName: "Địa chỉ mặc định",
      width: 200,
      renderCell: (params) => (
        <>{params?.row?.isDefault === true ? "Mặc định" : "Không"}</>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 200,
      renderCell: (params) => {
        const display = statusDisplay[params.value] || {
          label: "Không rõ",
          color: "default",
        };
        return (
          <Chip
            label={display.label}
            color={display.color}
            variant={display.variant}
          />
        );
      },
    },
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
    refetchAddress();
    showSnackbar("Làm mới danh sách địa chỉ thành công!", "success");
  };

  const handleDeleteCategories = async () => {
    try {
      await deleteAddress({ id: selectedCategoriesId }).unwrap();
      showSnackbar("Xoá địa chỉ thành công!", "success");
      setOpenDeleteDialog(false);
      setSelectedCategoriesId(null);
      refetchAddress();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleRestoreCategories = async () => {
    try {
      await restoreAddress({ id: selectedCategoriesId }).unwrap();
      showSnackbar("Khôi phục địa chỉ thành công!", "success");
      setOpenRestoreDialog(false);
      setSelectedCategoriesId(null);
      refetchAddress();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  if (isErrorAddress) {
    return (
      <ErrorDisplay
        error={{
          message: "Không tải được danh sách địa chỉ.",
        }}
      />
    );
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Địa chỉ</Typography>

      <Button
        variant="outlined"
        onClick={handleRefresh}
        startIcon={<Refresh />}
        sx={{ mb: 3, mt: 3 }}
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
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={handleCloseDeleteDialog}
          >
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
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={handleCloseRestoreDialog}
          >
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
    </DashboardLayoutWrapper>
  );
};

export default AddressManagement;
