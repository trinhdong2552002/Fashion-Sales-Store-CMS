import React, { useState, useEffect, Component } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  PaginationItem,
  styled,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListImagesQuery,
  useUploadImageMutation,
  useDeleteImageMutation,
} from "@/services/api/productImage";
import { useGetMyInfoQuery } from "@/services/api/auth";
import {
  setImages,
  setLoading as setImageLoading,
  setError as setImageError,
  selectImages,
  selectLoading as selectImageLoading,
  selectError as selectImageError,
} from "@/store/redux/productImage/reducer";

// Tùy chỉnh nút Back và Forward
const CustomPaginationItem = styled(PaginationItem)(({ theme }) => ({
  "&.MuiPaginationItem-previousNext": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "&.Mui-disabled": {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
    },
    borderRadius: "4px",
    margin: "0 5px",
    padding: "8px",
  },
}));

// ErrorBoundary component để bắt lỗi
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.imagesData !== this.props.imagesData && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return <Alert severity="error">Đã xảy ra lỗi khi hiển thị bảng hình ảnh.</Alert>;
    }
    return this.props.children;
  }
}

const ProductImagesManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const images = useSelector(selectImages);
  const imageLoading = useSelector(selectImageLoading);
  const imageError = useSelector(selectImageError);

  const [page, setPage] = useState(0); // Trang bắt đầu từ 0
  const [pageSize, setPageSize] = useState(10); // Mỗi trang 10 hình ảnh
  const [totalRows, setTotalRows] = useState(0); // Tổng số hình ảnh
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [imageIdToDelete, setImageIdToDelete] = useState(null);

  const { data: userInfo, error: userError, isLoading: userLoading } = useGetMyInfoQuery();
  const {
    data: imagesData,
    isLoading: isFetchingImages,
    error: fetchImagesError,
    refetch: refetchImages,
  } = useListImagesQuery({ pageNo: page + 1, pageSize }, { skip: userLoading });

  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  useEffect(() => {
    dispatch(setImageLoading(isFetchingImages));
    if (fetchImagesError) {
      const errorMessage = fetchImagesError?.data?.message || "Lỗi khi tải danh sách hình ảnh";
      dispatch(setImageError(errorMessage));
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } else if (imagesData && imagesData.items) {
      const validImages = imagesData.items.filter(
        (image) => image && image.id && image.fileName && image.imageUrl
      );
      dispatch(setImages(validImages));
      dispatch(setImageError(null));
      setTotalRows(imagesData.totalItems || 0);
      console.log("Images in state after filtering:", validImages);
      console.log("Total rows:", imagesData.totalItems);
    } else {
      dispatch(setImages([]));
      setTotalRows(0);
    }
  }, [imagesData, isFetchingImages, fetchImagesError, dispatch]);

  const columns = [
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

    console.log("Selected file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    let fileName = file.name;
    let fileToUpload = file;

    const existingImage = images.find((image) => image.fileName === fileName);
    if (existingImage) {
      const fileNameParts = fileName.split(".");
      const baseName = fileNameParts.slice(0, -1).join(".");
      const extension = fileNameParts[fileNameParts.length - 1];
      fileName = `${baseName}_${Date.now()}.${extension}`;
      fileToUpload = new File([file], fileName, { type: file.type });
      setSnackbar({
        open: true,
        message: `Tên file "${file.name}" đã tồn tại. Đã đổi thành "${fileName}".`,
        severity: "info",
      });
    }

    try {
      console.log("Uploading file:", fileToUpload);
      const response = await uploadImage(fileToUpload).unwrap();
      console.log("Upload response:", response);
      setSnackbar({
        open: true,
        message: "Tải lên hình ảnh thành công!",
        severity: "success",
      });
      refetchImages();
    } catch (error) {
      console.error("Upload error:", {
        status: error.error?.status,
        data: error.error?.data,
        originalError: error,
      });
      const errorMessage =
        error.error?.data?.message ||
        error.error?.data?.error ||
        `Lỗi khi tải lên hình ảnh (Status: ${error.error?.status}, Error: ${error.error?.data?.error || "Unknown"})`;
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
      refetchImages();
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
    refetchImages();
    setSnackbar({
      open: true,
      message: "Đã làm mới dữ liệu hình ảnh!",
      severity: "info",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (userLoading || isFetchingImages) {
    return <CircularProgress />;
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Hình ảnh Sản phẩm
      </Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
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
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Làm mới
        </Button>
      </Box>

      {fetchImagesError ? (
        <Alert severity="error">{fetchImagesError?.data?.message || "Lỗi khi tải hình ảnh"}</Alert>
      ) : images.length === 0 ? (
        <Alert severity="info">Hiện tại không có hình ảnh nào.</Alert>
      ) : (
        <ErrorBoundary imagesData={imagesData}>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={images}
              columns={columns}
              paginationMode="server" // Phân trang phía server
              rowCount={totalRows} // Tổng số hình ảnh
              page={page}
              pageSize={pageSize}
              onPageChange={(newPage) => setPage(newPage)} // Cập nhật trang
              onPageSizeChange={(newPageSize) => {
                setPageSize(newPageSize);
                setPage(0); // Reset về trang đầu khi đổi pageSize
              }}
              rowsPerPageOptions={[10, 20, 50]} // Tùy chọn số hàng mỗi trang
              getRowId={(row) => row.id}
              disableSelectionOnClick
              aria-label="Bảng hình ảnh sản phẩm"
              localeText={{
                noRowsLabel: "Không có dữ liệu",
              }}
              slots={{
                pagination: () => (
                  <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                    <Typography variant="body2">
                      Tổng số hình ảnh: {totalRows}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <CustomPaginationItem
                        type="previous"
                        component={Button}
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                      />
                      <Typography variant="body2" mx={2}>
                        Trang {page + 1} / {Math.ceil(totalRows / pageSize)}
                      </Typography>
                      <CustomPaginationItem
                        type="next"
                        component={Button}
                        disabled={page >= Math.ceil(totalRows / pageSize) - 1}
                        onClick={() => setPage(page + 1)}
                      />
                    </Box>
                  </Box>
                ),
              }}
            />
          </div>
        </ErrorBoundary>
      )}

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Xác nhận xóa hình ảnh</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa hình ảnh này không? Hành động này không thể hoàn tác.
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