import { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/Dashboard_layout";
import {
  useGetAllBranchesByAdminQuery,
  useAddBranchesMutation,
  useUpdateBranchesMutation,
  useDeleteBranchesMutation,
  useRestoreBranchesMutation,
} from "@/services/api/branch";
import { Add, Delete, Edit, Refresh, Restore } from "@mui/icons-material";
import { useSnackbar } from "@/components/Snackbar";
import TableData from "@/components/Table_data";
import StatusChip from "@/components/Status_chip";
import BranchAddDialog from "./shared/branch_add_dialog";
import BranchEditDialog from "./shared/branch_edit_dialog";
import BranchDeleteDialog from "./shared/branch_delete_dialog";
import BranchRestoreDialog from "./shared/branch_restore_dialog";

const BranchManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBranchesId, setSelectedBranchesId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newBranches, setNewBranches] = useState({
    name: "",
    location: "",
    phone: "",
  });

  const {
    data: dataBranches,
    isLoading: isLoadingBranches,
    error: errorBranches,
    isError: isErrorBranches,
    refetch: refetchBranches,
  } = useGetAllBranchesByAdminQuery(
    { page: paginationModel.page + 0, size: paginationModel.pageSize },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [addBranches] = useAddBranchesMutation();
  const [updateBranches] = useUpdateBranchesMutation();
  const [deleteBranches] = useDeleteBranchesMutation();
  const [restoreBranches] = useRestoreBranchesMutation();

  const dataRowBranches = dataBranches?.result?.items || [];
  const totalRows = dataBranches?.result?.totalItems || 0;

  const columnsBranches = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên chi nhánh", width: 200 },
    { field: "location", headerName: "Địa điểm", width: 200 },
    { field: "phone", headerName: "Số điện thoại", width: 200 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 200,
      renderCell: (params) => {
        return <StatusChip status={params.value} />;
      },
    },
    {
      field: "createdBy",
      headerName: "Người tạo",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.createdBy || "--"}
        </div>
      ),
    },
    {
      field: "updatedBy",
      headerName: "Người cập nhật",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.updatedBy || "--"}
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.createdAt
            ? new Date(params.row.createdAt).toLocaleDateString("vi-VN")
            : "N/A"}
        </div>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Ngày cập nhật",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.updatedAt
            ? new Date(params.row.updatedAt).toLocaleDateString("vi-VN")
            : "--"}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditBranches(params.row.id)}>
            <Edit color="primary" />
          </IconButton>
          {params.row?.status === "INACTIVE" ? (
            <IconButton onClick={() => handleOpenRestoreDialog(params.row.id)}>
              <Restore color="success" />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleOpenDeleteDialog(params.row.id)}>
              <Delete color="error" />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const handleOpenDeleteDialog = (id) => {
    setSelectedBranchesId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBranchesId(null);
  };

  const handleOpenRestoreDialog = (id) => {
    setSelectedBranchesId(id);
    setOpenRestoreDialog(true);
  };

  const handleCloseRestoreDialog = () => {
    setSelectedBranchesId(null);
    setOpenRestoreDialog(false);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedBranchesId(null);
  };

  const handleRefresh = () => {
    refetchBranches();
    showSnackbar("Danh sách chi nhánh đã được làm mới!", "info");
  };

  const handleDeleteBranches = async () => {
    try {
      await deleteBranches({ branchId: selectedBranchesId }).unwrap();
      showSnackbar("Xoá chi nhánh thành công!", "success");
      setOpenDeleteDialog(false);
      setSelectedBranchesId(null);
      refetchBranches();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleRestoreBranches = async () => {
    try {
      await restoreBranches({ branchId: selectedBranchesId }).unwrap();
      showSnackbar("Khôi phục chi nhánh thành công!", "success");
      setOpenRestoreDialog(false);
      setSelectedBranchesId(null);
      refetchBranches();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleAddBranches = async () => {
    setSubmitted(true);

    if (!newBranches.name || !newBranches.location || !newBranches.phone) {
      return;
    }

    try {
      await addBranches({
        name: newBranches.name,
        location: newBranches.location,
        phone: newBranches.phone,
      }).unwrap();
      showSnackbar("Thêm chi nhánh thành công!", "success");
      setNewBranches({ name: "", location: "", phone: "" });
      setOpenAddDialog(false);
      setSubmitted(false);
      refetchBranches();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleEditBranches = (id) => {
    const branchesToEdit = dataRowBranches.find((item) => item.id === id);

    if (branchesToEdit) {
      setNewBranches({
        name: branchesToEdit.name,
        location: branchesToEdit.location,
        phone: branchesToEdit.phone,
      });
      setSelectedBranchesId(id);
      setOpenEditDialog(true);
    }
  };

  const handleUpdateBranches = async () => {
    setSubmitted(true);

    try {
      await updateBranches({
        branchId: selectedBranchesId,
        ...newBranches,
      }).unwrap();
      showSnackbar("Cập nhật chi nhánh thành công!", "success");
      setNewBranches({ name: "", location: "", phone: "" });
      setSelectedBranchesId(null);
      setOpenEditDialog(false);
      setSubmitted(false);
      refetchBranches();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Chi nhánh</Typography>
      <Box
        sx={{ mt: 3, mb: 3, gap: { xs: 2, md: 0 } }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={{
          xs: "stretch",
          sm: "center",
          md: "center",
        }}
        flexDirection={{
          xs: "column",
          sm: "row",
          md: "row",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
          Làm mới
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenAddDialog(true);
            setNewBranches({
              name: "",
              location: "",
              phone: "",
            });
          }}
          startIcon={<Add />}
        >
          Thêm chi nhánh
        </Button>
      </Box>

      <TableData
        rows={dataRowBranches}
        totalRows={totalRows}
        columnsData={columnsBranches}
        loading={isLoadingBranches}
        error={
          isErrorBranches && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorBranches} || Không tải được dữ liệu.
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 15, 20]}
      />

      <BranchAddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onSubmit={handleAddBranches}
        newBranches={newBranches}
        setNewBranches={setNewBranches}
        submitted={submitted}
      />

      <BranchEditDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateBranches}
        newBranches={newBranches}
        setNewBranches={setNewBranches}
        submitted={submitted}
      />

      <BranchDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteBranches}
      />

      <BranchRestoreDialog
        open={openRestoreDialog}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleRestoreBranches}
      />
    </DashboardLayoutWrapper>
  );
};

export default BranchManagement;
