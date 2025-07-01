import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  Alert,
  Snackbar,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";

import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListImagesQuery,
  useUploadImageMutation,
  useDeleteImageMutation,
} from "@/services/api/productImage";
import { useGetMyInfoQuery } from "@/services/api/auth";
import { useState } from "react";

const ProductImagesManagement = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [imageIdToDelete, setImageIdToDelete] = useState(null);

  const { isLoading: userLoading } = useGetMyInfoQuery();
  const {
    data: dataImages,
    isLoading: isLoadingImages,
    isError: isErrorImages,
    refetch,
  } = useListImagesQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
      fileType: "PRODUCT_IMAGE",
    },
    { skip: userLoading },
    { refetchOnMountOrArgChange: true }
  );
  console.log("dataImages", dataImages);

  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const dataRowImages = dataImages?.result?.items || [];
  const totalRows = dataImages?.result?.totalItems || 0;

  const columnsImage = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "fileName", headerName: "Tên file", width: 150 },
    {
      field: "imageUrl",
      headerName: "Hình ảnh",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.row.imageUrl}
          alt={params.row.fileName}
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      field: "imageUrlShort",
      headerName: "Mã hình ảnh",
      width: 150,
      renderCell: (params) => {
        if (!params.row || !params.row.imageUrl) {
          return "N/A";
        }
        const urlParts = params.row.imageUrl.split("/");
        return urlParts[urlParts.length - 1].split(".")[0];
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => {
            setImageIdToDelete(params.row.id);
            setOpenDeleteDialog(true);
          }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);

    if (!file) {
      console.log("No file selected");
      setSnackbar({
        open: true,
        message: "Vui lòng chọn một file để tải lên!",
        severity: "warning",
      });
      return;
    }

    let fileToUpload = file;

    try {
      console.log("Uploading file:", fileToUpload);
      const response = await uploadImage(fileToUpload).unwrap();
      console.log("Upload response:", response);
      setSnackbar({
        open: true,
        message: "Tải lên hình ảnh thành công!",
        severity: "success",
      });
      refetch();
    } catch (error) {
      console.error("Upload error:", {
        status: error.error?.status,
        data: error.error?.data,
        originalError: error,
      });
      const errorMessage =
        error.error?.data?.message ||
        error.error?.data?.error ||
        `Lỗi khi tải lên hình ảnh (Status: ${error.error?.status}, Error: ${
          error.error?.data?.error || "Unknown"
        })`;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleDeleteImage = async () => {
    try {
      await deleteImage(imageIdToDelete).unwrap();
      setSnackbar({
        open: true,
        message: "Xóa hình ảnh thành công!",
        severity: "success",
      });
      refetch();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi xóa hình ảnh";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setOpenDeleteDialog(false);
      setImageIdToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setImageIdToDelete(null);
  };

  const handleRefresh = () => {
    refetch();
    setSnackbar({
      open: true,
      message: "Đã làm mới dữ liệu hình ảnh!",
      severity: "info",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isErrorImages)
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách hình ảnh sản phẩm. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Hình ảnh Sản phẩm
      </Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Làm mới
        </Button>
        <Button
          variant="contained"
          color="primary"
          component="label"
          startIcon={<AddPhotoAlternateIcon />}
        >
          Tải lên hình ảnh
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleUploadImage}
          />
        </Button>
      </Box>

      <Box height={500} width={"100%"}>
        <DataGrid
          columns={columnsImage}
          rows={dataRowImages}
          rowsPerPageOptions={[10, 20, 50]}
          rowCount={totalRows}
          loading={isLoadingImages}
          disableSelectionOnClick
          slotProps={{
            loadingOverlay: {
              variant: "linear-progress",
              noRowsVariant: "linear-progress",
            },
          }}
          aria-label="Bảng hình ảnh sản phẩm"
          localeText={{
            noRowsLabel: "Không có dữ liệu",
          }}
          pagination
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 15, 20]}
        />
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa hình ảnh ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa hình ảnh này không ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteImage} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "right", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayoutWrapper>
  );
};

export default ProductImagesManagement;
