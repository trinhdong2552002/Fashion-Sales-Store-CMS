import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListImagesQuery,
  useUploadImagesMutation,
  useDeleteImageMutation,
} from "@/services/api/productImage";
import { useGetMyInfoQuery } from "@/services/api/auth";
import { useState } from "react";
import { AddPhotoAlternate, Delete, Refresh } from "@mui/icons-material";
import ErrorDisplay from "@/components/ErrorDisplay";
import SnackbarComponent from "@/components/Snackbar";
import { PreviewImage } from "@/components/PreviewImage";

const ProductImagesManagement = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 15,
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

  const [uploadImage] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  const dataRowImages = dataImages?.result?.items || [];
  const totalRows = dataImages?.result?.totalItems || 0;

  const columnsImage = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "fileName", headerName: "Tên file", width: 200 },
    {
      field: "imageUrl",
      headerName: "Hình ảnh sản phẩm",
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
      field: "imageUrlShort",
      headerName: "Mã hình ảnh",
      width: 200,
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
          <Delete />
        </IconButton>
      ),
    },
  ];

  const handleUploadImage = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setIsUploadingImage(true);
    try {
      await uploadImage(files).unwrap();
      setSnackbar({
        open: true,
        message: "Upload hình ảnh thành công!",
        severity: "success",
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Upload hình ảnh thất bại!",
        severity: "error",
      });
      console.error("Lỗi upload:", error);
    } finally {
      setIsUploadingImage(false);
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
      setOpenDeleteDialog(false);
      setImageIdToDelete(null);
      refetch();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi xóa hình ảnh";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
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
      message: "Danh sách hình ảnh sản phẩm đã được làm mới!",
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
            "Không tải được danh sách hình ảnh sản phẩm.",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Hình ảnh Sản phẩm</Typography>
      <Box
        sx={{ mb: 3, mt: 3 }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Refresh />}
          onClick={handleRefresh}
        >
          Làm mới
        </Button>
        <Button
          variant="contained"
          color="primary"
          component="label"
          startIcon={<AddPhotoAlternate />}
          disabled={isUploadingImage}
        >
          {isUploadingImage ? "Đang tải..." : "Tải lên hình ảnh"}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleUploadImage}
          />
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
          pageSizeOptions={[15, 20, 30]}
        />
      </Box>

      <Dialog open={openDeleteDialog}>
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa hình ảnh ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa hình ảnh này không ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{p: 3}}>
          <Button onClick={handleCloseDeleteDialog} color="error" variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleDeleteImage}
            color="error"
            variant="contained"
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <PreviewImage
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
      <SnackbarComponent snackbar={snackbar} onClose={handleCloseSnackbar} />
    </DashboardLayoutWrapper>
  );
};

export default ProductImagesManagement;
