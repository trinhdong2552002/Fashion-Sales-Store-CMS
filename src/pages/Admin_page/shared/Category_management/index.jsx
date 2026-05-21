import { useState, Fragment } from "react";
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
import DashboardLayoutWrapper from "@/layouts/Dashboard_layout";
import {
  useGetAllCategoriesByAdminQuery,
  useAddCategoriesMutation,
  useDeleteCategoriesMutation,
  useRestoreCategoriesMutation,
  useUpdateCategoriesMutation,
} from "@/services/api/category";
import { Add, Delete, Edit, Refresh, Restore } from "@mui/icons-material";
import { useSnackbar } from "@/components/Snackbar";
import TableData from "@/components/Table_data";
import StatusChip from "@/components/Status_chip";
import CategoryAddDialog from "./shared/category_add_dialog";
import CategoryEditDialog from "./shared/category_edit_dialog";
import CategoryDeleteDialog from "./shared/category_delete_dialog";
import CategoryRestoreDialog from "./shared/category_restore_dialog";

const CategoryManagement = () => {
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
    error: errorCategories,
    isError: isErrorCategories,
    refetch: refetchCategories,
  } = useGetAllCategoriesByAdminQuery(
    { page: paginationModel.page + 0, size: paginationModel.pageSize },
    {
      refetchOnMountOrArgChange: true,
    },
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

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSubmitted(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    // setSelectedCategoriesId(null);
    setSubmitted(false);
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
        categoryId: selectedCategoriesId,
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
      await deleteCategories({ categoryId: selectedCategoriesId }).unwrap();
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
      await restoreCategories({ categoryId: selectedCategoriesId }).unwrap();
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

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý danh mục</Typography>

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

      <TableData
        rows={dataRowCategories}
        totalRows={totalRows}
        columnsData={columnsCategories}
        loading={isLoadingCategories}
        error={
          isErrorCategories && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorCategories} || "Không tải được dữ liệu."
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 15, 20]}
      />

      <CategoryAddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onSubmit={handleAddCategories}
        newCategories={newCategories}
        setNewCategories={setNewCategories}
        submitted={submitted}
      />

      <CategoryEditDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateCategories}
        newCategories={newCategories}
        setNewCategories={setNewCategories}
        submitted={submitted}
      />

      <CategoryDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteCategories}
      />

      <CategoryRestoreDialog
        open={openRestoreDialog}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleRestoreCategories}
      />
    </DashboardLayoutWrapper>
  );
};

export default CategoryManagement;
