import { Fragment, useState } from "react";
import {
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { Delete, Refresh, Restore } from "@mui/icons-material";
import {
  useGetAllAddressesByAdminQuery,
  useDeleteAddressMutation,
  useRestoreAddressMutation,
} from "@/services/api/address";
import { useSnackbar } from "@/components/Snackbar";
import TableData from "@/components/TableData";
import StatusChip from "@/components/StatusChip";

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
    error: errorAddress,
    refetch: refetchAddress,
  } = useGetAllAddressesByAdminQuery(
    {
      page: paginationModel.page + 0,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    },
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
        return <StatusChip status={params.value} />;
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

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý địa chỉ</Typography>

      <Button
        variant="outlined"
        onClick={handleRefresh}
        startIcon={<Refresh />}
        sx={{ my: 3 }}
      >
        Làm mới
      </Button>

      <TableData
        rows={dataRowAddresses}
        totalRows={totalRows}
        columnsData={columnsAddress}
        loading={isLoadingAddress}
        error={
          isErrorAddress && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorAddress} || "Không tải được dữ liệu."
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 15, 20]}
      />

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
