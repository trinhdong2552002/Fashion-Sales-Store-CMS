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
import { Add, Delete, Edit, Refresh, Restore } from "@mui/icons-material";
import { useSnackbar } from "@/components/Snackbar";
import { PreviewImage } from "@/components/Preview_image";
import TableData from "@/components/Table_data";
import StatusChip from "@/components/Status_chip";

import {
  useGetAllCategoriesByAdminQuery,
  useAddCategoriesMutation,
  useDeleteCategoriesMutation,
  useRestoreCategoriesMutation,
  useUpdateCategoriesMutation,
} from "@/services/api/category";
import { useGetAllFilesQuery } from "@/services/api/file";
import CategoryAddDialog from "./shared/category_add_dialog";
import CategoryEditDialog from "./shared/category_edit_dialog";
import CategoryDeleteDialog from "./shared/category_delete_dialog";
import CategoryRestoreDialog from "./shared/category_restore_dialog";

const CategoryManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [previewImage, setPreviewImage] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedCategoriesId, setSelectedCategoriesId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [newCategories, setNewCategories] = useState({
    name: "",
    imageUrl: "",
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

  const { data: dataImages, refetch: refetchImages } = useGetAllFilesQuery({
    page: 0,
    size: 1000,
  });

  const [addCategories] = useAddCategoriesMutation();
  const [updateCategories] = useUpdateCategoriesMutation();
  const [deleteCategories] = useDeleteCategoriesMutation();
  const [restoreCategories] = useRestoreCategoriesMutation();

  const dataRowCategories = dataCategories?.result?.items || [];
  const totalRows = dataCategories?.result?.totalItems || 0;

  const columnsCategories = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên danh mục", width: 200 },
    {
      field: "imageUrl",
      headerName: "Hình ảnh danh mục",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.row.imageUrl}
          alt={params.row.fileName}
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => setPreviewImage(params.value)}
        />
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
    showSnackbar("Danh sách danh mục đã được làm mới!", "info");
  };

  const handleAddCategories = async () => {
    setSubmitted(true);

    try {
      await addCategories({
        name: newCategories.name,
        imageUrl: newCategories.imageUrl,
      }).unwrap();
      showSnackbar("Thêm danh mục thành công !", "success");
      setNewCategories({ name: "", imageUrl: "" });
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
        imageUrl: categoryToEdit.imageUrl,
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
      setNewCategories({ name: "", imageUrl: "" });
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
            setNewCategories({ name: "", imageUrl: "" });
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
        pageSizeOptions={[25, 50, 100]}
      />

      <CategoryAddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onSubmit={handleAddCategories}
        newCategories={newCategories}
        setNewCategories={setNewCategories}
        dataImages={dataImages}
        refreshImages={refetchImages}
        submitted={submitted}
      />

      <CategoryEditDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateCategories}
        newCategories={newCategories}
        setNewCategories={setNewCategories}
        dataImages={dataImages}
        // refreshImages={refetchImages}
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

      <PreviewImage
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </DashboardLayoutWrapper>
  );
};

export default CategoryManagement;
