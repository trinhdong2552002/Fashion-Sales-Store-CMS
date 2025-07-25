import { useState } from "react";
import { Typography, IconButton, Chip } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import SnackbarComponent from "@/components/Snackbar";
import ErrorDisplay from "@/components/ErrorDisplay";
import {
  useListAllProduct_VariantsByProductQuery,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useRestoreProductVariantMutation,
} from "@/services/api/productVariant";
import { skipToken } from "@reduxjs/toolkit/query";
import { useListProductsForAdminQuery } from "@/services/api/product";
import { Delete, Edit, Restore } from "@mui/icons-material";
import TableData from "@/components/TableData";
import { ProductVariantToolbar } from "./shared/ProductVariantToolbar";
import { ProductVariantDialogDelete } from "./shared/ProductVariantDialogDelete";
import { ProductVariantDialogRestore } from "./shared/ProductVariantDialogRestore";
import { ProductVariantDialogEdit } from "./shared/ProductVariantDialogEdit";
import { PreviewImage } from "@/components/PreviewImage";
import { statusDisplay } from "/src/constants/badgeStatus";

const ProductVariantsManagement = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductVariantId, setSelectedProductVariantId] =
    useState(null);
  // const [submitted, setSubmitted] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newProductVariant, setNewProductVariant] = useState({
    price: "",
    quantity: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    data: dataProducts,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
    refetch: refetchProducts,
  } = useListProductsForAdminQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const {
    data: dataProductVariants,
    isLoading: isLoadingProductVariant,
    isError: isErrorProductVariant,
    refetch: refetchProductVariants,
  } = useListAllProduct_VariantsByProductQuery(
    selectedProductId
      ? {
          id: selectedProductId,
          page: paginationModel.page,
          size: paginationModel.pageSize,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  // Lọc sản phẩm trạng thái theo ACTIVE
  const activeProducts = dataProducts?.result?.items.filter(
    (product) => product.status === "ACTIVE"
  );

  const dataRowProductVariants = dataProductVariants?.result?.items || [];
  const totalRows = dataProductVariants?.result?.totalItems || 0;

  const [updateProductVariant] = useUpdateProductVariantMutation();
  const [deleteProductVariant] = useDeleteProductVariantMutation();
  const [restoreProductVariant] = useRestoreProductVariantMutation();

  const columnsProductVariant = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "price", headerName: "Giá", width: 150 },
    { field: "quantity", headerName: "Số lượng", width: 150 },
    { field: "isAvailable", headerName: "Có sẵn", width: 150 },
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
      field: "size",
      headerName: "Kích thước",
      width: 120,
      renderCell: (params) => params.row?.size?.name || "-",
    },
    {
      field: "color",
      headerName: "Màu sắc",
      width: 120,
      renderCell: (params) => params.row?.color?.name || "-",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            variant="text"
            color="primary"
            onClick={() => handleEditProductVariant(params.row.id)}
          >
            <Edit />
          </IconButton>
          {params.row?.status === "INACTIVE" ? (
            <IconButton
              onClick={() => handleOpenRestoreDialog(params.row.id)}
              color="success"
            >
              <Restore />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleOpenDeleteDialog(params.row.id)}>
              <Delete color="error" />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedProductVariantId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedProductVariantId(null);
    setOpenDeleteDialog(false);
  };

  const handleOpenRestoreDialog = (id) => {
    setSelectedProductVariantId(id);
    setOpenRestoreDialog(true);
  };

  const handleCloseRestoreDialog = () => {
    setSelectedProductVariantId(null);
    setOpenRestoreDialog(false);
  };

  const handleRefresh = () => {
    refetchProducts();
    setSnackbar({
      open: true,
      message: "Danh sách biến thể sản phẩm đã được làm mới!",
      severity: "info",
    });
  };

  const handleEditProductVariant = (id) => {
    const productVariantToEdit = dataRowProductVariants.find(
      (item) => item.id === id
    );
    if (productVariantToEdit) {
      setNewProductVariant({
        price: productVariantToEdit.price,
        quantity: productVariantToEdit.quantity,
      });
    }
    setSelectedProductVariantId(id);
    setOpenEditDialog(true);
  };

  const handleUpdateProductVariant = async () => {
    // setSubmitted(true);

    try {
      await updateProductVariant({
        id: selectedProductVariantId,
        ...newProductVariant,
      }).unwrap();
      setSnackbar({
        open: true,
        message: "Cập nhật biến thể thành công!",
        severity: "success",
      });
      setNewProductVariant({
        price: "",
        quantity: "",
      });
      setSelectedProductVariantId(null);
      setOpenEditDialog(false);
      // setSubmitted(false);
      refetchProductVariants();
    } catch (error) {
      const errorMessage = error.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleDeleteProductVariant = async () => {
    try {
      await deleteProductVariant({ id: selectedProductVariantId }).unwrap();
      setSnackbar({
        open: true,
        message: "Xóa sản phẩm thành công!",
        severity: "success",
      });
      setOpenDeleteDialog(false);
      setSelectedProductVariantId(null);
      refetchProductVariants();
    } catch (error) {
      const errorMessage = error.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleRestoreProductVariant = async () => {
    try {
      await restoreProductVariant({ id: selectedProductVariantId }).unwrap();
      setSnackbar({
        open: true,
        message: "Khôi phục sản phẩm thành công!",
        severity: "success",
      });
      setOpenRestoreDialog(false);
      setSelectedProductVariantId(null);
      refetchProductVariants();
    } catch (error) {
      const errorMessage = error.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  if (isErrorProduct || isErrorProductVariant) {
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách sản phẩm hoặc biến thể. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Biến thể Sản phẩm</Typography>

      <ProductVariantToolbar
        handleRefresh={handleRefresh}
        selectedProductId={selectedProductId}
        setSelectedProductId={setSelectedProductId}
        activeProducts={activeProducts}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />

      <TableData
        rows={dataRowProductVariants}
        totalRows={totalRows}
        columnsData={columnsProductVariant}
        loading={isLoadingProduct || isLoadingProductVariant}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 15, 20]}
      />

      <ProductVariantDialogEdit
        openEditDialog={openEditDialog}
        closeEditDialog={() => setOpenEditDialog(false)}
        handleUpdateProductVariant={handleUpdateProductVariant}
        newProductVariant={newProductVariant}
        setNewProductVariant={setNewProductVariant}
        // submitted={submitted}
      />

      <ProductVariantDialogDelete
        openDeleteDialog={openDeleteDialog}
        closeDeleteDialog={handleCloseDeleteDialog}
        handleDeleteProductVariant={handleDeleteProductVariant}
      />

      <ProductVariantDialogRestore
        openRestoreDialog={openRestoreDialog}
        closeRestoreDialog={handleCloseRestoreDialog}
        handleRestoreProductVariant={handleRestoreProductVariant}
      />

      <PreviewImage
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
      <SnackbarComponent snackbar={snackbar} onClose={handleCloseSnackbar} />
    </DashboardLayoutWrapper>
  );
};

export default ProductVariantsManagement;
