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
import { statusDisplay } from "/src/constants/badgeStatus";
import { useSnackbar } from "@/components/Snackbar";

const CategoriesManagement = () => {
  const { showSnackbar } = useSnackbar();
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

  const {
    data: dataCategories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    refetch: refetchCategories,
  } = useListCategoriesForAdminQuery(
    {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
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
    refetchCategories();
    showSnackbar("Danh sách danh mục đã được làm mới!", "success");
  };

  const handleAddCategories = async () => {
    setSubmitted(true);

    try {
      await addCategories({
        name: newCategories.name,
        description: newCategories.description,
      }).unwrap();
      showSnackbar("Thêm danh mục thành công !", "success");
      setNewCategories({ name: "", description: "" });
      setOpenAddDialog(false);
      setSubmitted(false);
      refetchCategories();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
        return;
      }
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
      showSnackbar("Cập nhật danh mục thành công !", "success");
      setNewCategories({ name: "", description: "" });
      setSelectedCategoriesId(null);
      setOpenEditDialog(false);
      setSubmitted(false);
      refetchCategories();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
        return;
      }
    }
  };

  const handleDeleteCategories = async () => {
    try {
      await deleteCategories({ id: selectedCategoriesId }).unwrap();
      showSnackbar("Xoá danh mục thành công !", "success");
      setOpenDeleteDialog(false);
      setSelectedCategoriesId(null);
      refetchCategories();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
        return;
      }
    }
  };

  const handleRestoreCategories = async () => {
    try {
      await restoreCategories({ id: selectedCategoriesId }).unwrap();
      showSnackbar("Khôi phục danh mục thành công !", "success");
      setOpenRestoreDialog(false);
      setSelectedCategoriesId(null);
      refetchCategories();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
        return;
      }
    }
  };

  if (isErrorCategories)
    return (
      <ErrorDisplay
        error={{
          message: "Không tải được danh sách danh mục.",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Danh mục</Typography>

      <Box
        sx={{
          mt: 3,
          mb: 3,
          gap: {
            xs: 2,
            md: 0,
          },
        }}
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
    </DashboardLayoutWrapper>
  );
};

export default CategoriesManagement;
