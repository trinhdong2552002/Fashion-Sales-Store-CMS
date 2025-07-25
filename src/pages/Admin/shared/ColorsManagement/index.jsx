import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} from "@/services/api/color";
import { Add, Delete, Edit, Refresh } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";
import SnackbarComponent from "@/components/Snackbar";

const ColorsManagement = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newColor, setNewColor] = useState({ name: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const {
    data: dataColor,
    isLoading: isLoadingColor,
    isError: isErrorColor,
    refetch,
  } = useListColorsQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedColorId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedColorId(null);
    setOpenDeleteDialog(false);
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      severity: "info",
      message: "Danh sách màu sắc đã được làm mới!",
    });
  };

  const handleAddColor = async (data) => {
    setSubmitted(true);

    try {
      await addColor({
        name: data?.name,
      }).unwrap();
      setSnackbar({
        open: true,
        message: "Thêm màu sắc thành công!",
        severity: "success",
      });
      setNewColor({ name: "" });
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

  const handleEditColor = (id) => {
    const colorsEdit = dataRowColors.find((item) => item.id === id);
    console.log("colorEdit", colorsEdit);

    if (colorsEdit) {
      setNewColor({
        name: colorsEdit.name,
      });
    }
    setSelectedColorId(id);
    setOpenUpdateDialog(true);
  };

  const handleUpdateColor = async () => {
    setSubmitted(true);

    try {
      console.log("Selected Color ID:", selectedColorId);
      await updateColor({
        id: selectedColorId,
        ...newColor,
      }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Cập nhật màu sắc thành công!",
      });
      setNewColor({ name: "" });
      setOpenUpdateDialog(false);
      setSubmitted(false);
      setSelectedColorId(null);
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

  const handleDeleteColor = async () => {
    try {
      await deleteColor({ id: selectedColorId }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Xóa màu sắc thành công!",
      });
      setOpenDeleteDialog(false);
      setSelectedColorId(null);
      refetch();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  if (isErrorColor)
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách màu sắc. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Màu sắc</Typography>

      <Box
        sx={{ mb: 3, mt: 3 }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
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
          columns={columnsColor}
          rows={dataRowColors}
          loading={isLoadingColor}
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

      {/* TODO: Dialog add color */}
      <Dialog fullWidth open={openAddDialog}>
        <DialogTitle>Thêm màu sắc</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên màu sắc"
            value={newColor.name}
            onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newColor.name}
            helperText={
              submitted && !newColor.name ? "name không được để trống" : ""
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setOpenAddDialog(false)}
          >
            Hủy
          </Button>
          <Button onClick={() => handleAddColor(newColor)} variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* TODO: Dialog update color */}
      <Dialog fullWidth open={openUpdateDialog}>
        <DialogTitle>Cập nhật màu sắc</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên màu sắc"
            value={newColor.name}
            onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newColor.name}
            helperText={
              submitted && !newColor.name ? "name không được để trống" : ""
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setOpenUpdateDialog(false)}
          >
            Hủy
          </Button>
          <Button variant="contained" onClick={handleUpdateColor}>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* TODO: Dialog delete color */}
      <Dialog open={openDeleteDialog}>
        <DialogTitle>Xác nhận xóa ?</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa màu sắc này không ?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={handleCloseDeleteDialog}
          >
            Hủy
          </Button>
          <Button color="error" variant="contained" onClick={handleDeleteColor}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarComponent snackbar={snackbar} onClose={handleCloseSnackbar} />
    </DashboardLayoutWrapper>
  );
};

export default ColorsManagement;
