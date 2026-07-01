import { useState } from "react";
import { Typography, Button, IconButton, Box } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/dashboard-layout";
import {
  useGetAllColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} from "@/services/api/color";
import { Add, Delete, Edit, Refresh } from "@mui/icons-material";
import { useSnackbar } from "@/components/Snackbar";
import TableData from "@/components/table-data";
import ColorAddDialog from "./shared/color-add-dialog";
import ColorEditDialog from "./shared/color-edit-dialog";
import ColorDeleteDialog from "./shared/color-delete-dialog";

const ColorManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [newColor, setNewColor] = useState({ name: "" });

  const {
    data: dataColor,
    isLoading: isLoadingColor,
    isError: isErrorColor,
    error: errorColor,
    refetch: refetchColor,
  } = useGetAllColorsQuery(
    {
      page: paginationModel.page + 0,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [addColor] = useAddColorMutation();
  const [updateColor] = useUpdateColorMutation();
  const [deleteColor] = useDeleteColorMutation();

  const dataRowColors = dataColor?.result?.items || [];
  const totalRows = dataColor?.result?.totalItems || 0;

  const columnsColor = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên màu sắc", width: 200 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditColor(params.row.id)}>
            <Edit color="primary" />
          </IconButton>
          <IconButton
            onClick={() => handleOpenDeleteDialog(params.row.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const handleOpenDeleteDialog = (id) => {
    setSelectedColorId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedColorId(null);
    setOpenDeleteDialog(false);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedColorId(null);
  };

  const handleRefresh = () => {
    refetchColor();
    showSnackbar("Danh sách màu sắc đã được làm mới!", "info");
  };

  const handleAddColor = async () => {
    setSubmitted(true);

    try {
      await addColor({
        name: newColor.name,
      }).unwrap();
      showSnackbar("Thêm màu sắc thành công!", "success");
      setNewColor({ name: "" });
      setOpenAddDialog(false);
      setSubmitted(false);
      refetchColor();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleEditColor = (id) => {
    const colorsEdit = dataRowColors.find((item) => item.id === id);

    if (colorsEdit) {
      setNewColor({
        name: colorsEdit.name,
      });
    }
    setSelectedColorId(id);
    setOpenEditDialog(true);
  };

  const handleUpdateColor = async () => {
    setSubmitted(true);

    try {
      await updateColor({
        colorId: selectedColorId,
        ...newColor,
      }).unwrap();
      showSnackbar("Cập nhật màu sắc thành công!", "success");
      setNewColor({ name: "" });
      setOpenEditDialog(false);
      setSubmitted(false);
      setSelectedColorId(null);
      refetchColor();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleDeleteColor = async () => {
    try {
      await deleteColor({ colorId: selectedColorId }).unwrap();
      showSnackbar("Xóa màu sắc thành công!", "success");
      setOpenDeleteDialog(false);
      setSelectedColorId(null);
      refetchColor();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý màu sắc</Typography>

      <Box
        sx={{ my: 3 }}
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
          color="primary"
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
          Làm mới
        </Button>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setOpenAddDialog(true);
            setNewColor({
              name: "",
            });
          }}
        >
          Thêm màu sắc
        </Button>
      </Box>

      <TableData
        rows={dataRowColors}
        totalRows={totalRows}
        columnsData={columnsColor}
        loading={isLoadingColor}
        error={
          isErrorColor && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorColor} || "Không tải được dữ liệu."
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
      />

      <ColorAddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onSubmit={handleAddColor}
        newColor={newColor}
        setNewColor={setNewColor}
        submitted={submitted}
      />

      <ColorEditDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateColor}
        newColor={newColor}
        setNewColor={setNewColor}
        submitted={submitted}
      />

      <ColorDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteColor}
      />
    </DashboardLayoutWrapper>
  );
};

export default ColorManagement;
