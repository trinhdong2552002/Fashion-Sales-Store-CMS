import { Typography, Button, Box, IconButton } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/dashboard-layout";
import {
  useGetAllFilesQuery,
  useUploadMultipleFilesMutation,
  useDeleteFileMutation,
} from "@/services/api/file";
import { useState } from "react";
import { AddPhotoAlternate, Delete, Refresh } from "@mui/icons-material";
import { PreviewImage } from "@/components/preview-image";
import { useSnackbar } from "@/components/Snackbar";
import TableData from "@/components/table-data";
import FileDeleteDialog from "./shared/file-delete-dialog";

const FileManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [imageIdToDelete, setImageIdToDelete] = useState(null);

  const {
    data: dataFile,
    isLoading: isLoadingFile,
    isError: isErrorFile,
    error: errorFile,
    refetch: refetchFile,
  } = useGetAllFilesQuery(
    {
      page: paginationModel.page + 0,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [uploadFile] = useUploadMultipleFilesMutation();
  const [deleteFile] = useDeleteFileMutation();

  const dataRowFiles = dataFile?.result?.items || [];
  const totalRows = dataFile?.result?.totalItems || 0;

  const columnsFile = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "fileName", headerName: "Tên file", width: 200 },
    {
      field: "imageUrl",
      headerName: "Hình ảnh",
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

  const handleUploadFile = async (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      showSnackbar("Vui lòng chọn ít nhất một hình ảnh để tải lên.", "warning");
      return;
    }

    setIsUploadingImage(true);
    try {
      await uploadFile(files).unwrap();
      showSnackbar("Tải lên hình ảnh thành công!", "success");
      refetchFile();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteFile = async () => {
    try {
      await deleteFile(imageIdToDelete).unwrap();
      showSnackbar("Xóa hình ảnh thành công!", "success");
      setOpenDeleteDialog(false);
      setImageIdToDelete(null);
      refetchFile();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setImageIdToDelete(null);
  };

  const handleRefreshFile = () => {
    refetchFile();
    showSnackbar("Danh sách hình ảnh đã được làm mới!", "info");
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý file</Typography>
      <Box
        sx={{
          mb: 3,
          mt: 3,
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
          color="primary"
          startIcon={<Refresh />}
          onClick={handleRefreshFile}
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
          {isUploadingImage ? "Đang tải hình ảnh..." : "Tải lên hình ảnh"}
          <input
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={handleUploadFile}
          />
        </Button>
      </Box>

      <TableData
        rows={dataRowFiles}
        totalRows={totalRows}
        columnsData={columnsFile}
        loading={isLoadingFile}
        error={
          isErrorFile && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorFile} || Không tải được dữ liệu.
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
      />

      <FileDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteFile}
      />

      <PreviewImage
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </DashboardLayoutWrapper>
  );
};

export default FileManagement;
