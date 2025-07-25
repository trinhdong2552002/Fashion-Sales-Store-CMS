import { useState, Fragment } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Chip,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useAddCategoriesMutation,
  useDeleteCategoriesMutation,
  useListCategoriesForAdminQuery,
  useRestoreCategoriesMutation,
  useUpdateCategoriesMutation,
} from "@/services/api/categories";
import { Add, Delete, Edit, Refresh, Restore } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";
import SnackbarComponent from "@/components/Snackbar";
import { statusDisplay } from "/src/constants/badgeStatus";

const CategoriesManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedCategoriesId, setSelectedCategoriesId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newCategories, setNewCategories] = useState({
    name: "",
    description: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const {
    data: dataCategories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    refetch,
  } = useListCategoriesForAdminQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [addCategories] = useAddCategoriesMutation();
  const [updateCategories] = useUpdateCategoriesMutation();
  const [deleteCategories] = useDeleteCategoriesMutation();
  const [restoreCategories] = useRestoreCategoriesMutation();

  const dataRowCategories = dataCategories?.result?.items || [];
  const totalRows = dataCategories?.result?.totalItems || 0;

  const columnsCategories = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên danh mục", width: 200 },
    { field: "description", headerName: "Mô tả danh mục", width: 200 },
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
      field: "action",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <Fragment>
          <IconButton onClick={() => handleEditCategories(params.row.id)}>
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
      message: "Danh sách danh mục đã được làm mới!",
      severity: "info",
    });
  };

  const handleAddCategories = async () => {
    setSubmitted(true);

    try {
      await addCategories({
        name: newCategories.name,
        description: newCategories.description,
      }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Thêm danh mục thành công !",
      });
      setNewCategories({ name: "", description: "" });
      setOpenAddDialog(false);
      setSubmitted(false);
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

  const handleEditCategories = (id) => {
    const categoryToEdit = dataRowCategories.find((item) => item.id === id);

    if (categoryToEdit) {
      setNewCategories({
        name: categoryToEdit.name,
        description: categoryToEdit.description,
      });
      setSelectedCategoriesId(id);
      setOpenEditDialog(true);
    }
  };

  const handleUpdateCategories = async () => {
    setSubmitted(true);

    try {
      await updateCategories({
        id: selectedCategoriesId,
        ...newCategories,
      }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Cập nhật danh mục thành công !",
      });
      setNewCategories({ name: "", description: "" });
      setSelectedCategoriesId(null);
      setOpenEditDialog(false);
      setSubmitted(false);
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

  const handleDeleteCategories = async () => {
    try {
      await deleteCategories({ id: selectedCategoriesId }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Xoá danh mục thành công!",
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
      await restoreCategories({ id: selectedCategoriesId }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Khôi phục danh mục thành công !",
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

  if (isErrorCategories)
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách danh mục. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Danh mục</Typography>

      <Box
        sx={{ mt: 3, mb: 3 }}
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

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenAddDialog(true);
            setNewCategories({ name: "", description: "" });
          }}
          startIcon={<Add />}
        >
          Thêm danh mục
        </Button>
      </Box>

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
          columns={columnsCategories}
          rows={dataRowCategories}
          loading={isLoadingCategories}
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

      {/* TODO: Dialog add categories */}
      <Dialog fullWidth open={openAddDialog}>
        <DialogTitle>Thêm danh mục</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên danh mục"
            value={newCategories.name}
            onChange={(e) =>
              setNewCategories({ ...newCategories, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newCategories.name}
            helperText={
              submitted && !newCategories.name ? "name không được để trống" : ""
            }
          />
          <TextField
            label="Mô tả danh mục"
            value={newCategories.description}
            onChange={(e) =>
              setNewCategories({
                ...newCategories,
                description: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 3 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setOpenAddDialog(false)}
          >
            Huỷ
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategories}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* TODO: Dialog update categories */}
      <Dialog fullWidth open={openEditDialog}>
        <DialogTitle>Cập nhật danh mục</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên danh mục"
            value={newCategories.name}
            onChange={(e) =>
              setNewCategories({ ...newCategories, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newCategories.name}
            helperText={
              submitted && !newCategories.name ? "name không được để trống" : ""
            }
          />
          <TextField
            label="Mô tả danh mục"
            value={newCategories.description}
            onChange={(e) =>
              setNewCategories({
                ...newCategories,
                description: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 3 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setOpenEditDialog(false)}
          >
            Huỷ
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateCategories}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog}>
        <DialogTitle>Xác nhận xoá ?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xoá danh mục này không ?
          </Typography>
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
            Bạn có chắc chắn muốn khôi phục danh mục này không ?
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

      <SnackbarComponent snackbar={snackbar} onClose={handleCloseSnackbar} />
    </DashboardLayoutWrapper>
  );
};

export default CategoriesManagement;
