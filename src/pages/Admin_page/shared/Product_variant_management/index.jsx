import { useState } from "react";
import { Typography, IconButton, Chip, Box } from "@mui/material";
import { Delete, Edit, Restore } from "@mui/icons-material";
import TableData from "@/components/Table_data";
import ProductVariantToolbar from "./shared/product_variant_toolbar";
import ProductVariantDeleteDialog from "./shared/product_variant_delete_dialog";
import ProductVariantRestoreDialog from "./shared/product_variant_restore_dialog";
import ProductVariantEditDialog from "./shared/product_variant_edit_dialog";
import { useSnackbar } from "@/components/Snackbar";
import StatusChip from "@/components/Status_chip";
import DashboardLayoutWrapper from "@/layouts/Dashboard_layout";

import { skipToken } from "@reduxjs/toolkit/query";
import { useGetAllProductsByAdminQuery } from "@/services/api/product";
import { useGetAllProductVariantsByProductForAdminQuery } from "@/services/api/product";
import {
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useRestoreProductVariantMutation,
} from "@/services/api/product_variant";

const ProductVariantManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductVariantId, setSelectedProductVariantId] =
    useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [newProductVariant, setNewProductVariant] = useState({
    price: "",
    quantity: "",
  });

  const {
    data: dataProducts,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
    error: errorProduct,
    refetch: refetchProduct,
  } = useGetAllProductsByAdminQuery({
    refetchOnMountOrArgChange: true,
    page: 0,
    size: 1000,
  });

  const {
    data: dataProductVariants,
    isLoading: isLoadingProductVariant,
    isError: isErrorProductVariant,
    error: errorProductVariant,
    refetch: refetchProductVariants,
  } = useGetAllProductVariantsByProductForAdminQuery(
    selectedProductId
      ? {
          productId: selectedProductId,
          pageNo: paginationModel.page + 0,
          pageSize: paginationModel.pageSize,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
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
    {
      field: "isAvailable",
      headerName: "Biến thể sản phẩm có sẵn",
      width: 200,
      renderCell: (params) => (
        <>{params.row.isAvailable === true ? "Có sẵn" : "Không có sẵn"}</>
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
    refetchProduct();
    showSnackbar("Danh sách biến thể sản phẩm đã được làm mới!", "info");
  };

  const handleEditProductVariant = (id) => {
    const productVariantToEdit = dataRowProductVariants.find(
      (item) => item.id === id,
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
    setSubmitted(true);

    try {
      await updateProductVariant({
        productVariantId: selectedProductVariantId,
        ...newProductVariant,
      }).unwrap();
      showSnackbar("Cập nhật biến thể sản phẩm thành công!", "success");
      setNewProductVariant({
        price: "",
        quantity: "",
      });
      setSelectedProductVariantId(null);
      setOpenEditDialog(false);
      setSubmitted(false);
      refetchProductVariants();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleDeleteProductVariant = async () => {
    try {
      await deleteProductVariant({
        productVariantId: selectedProductVariantId,
      }).unwrap();
      showSnackbar("Xóa biến thể sản phẩm thành công!", "success");
      setOpenDeleteDialog(false);
      setSelectedProductVariantId(null);
      refetchProductVariants();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleRestoreProductVariant = async () => {
    try {
      await restoreProductVariant({
        productVariantId: selectedProductVariantId,
      }).unwrap();
      showSnackbar("Khôi phục biến thể sản phẩm thành công!", "success");
      setOpenRestoreDialog(false);
      setSelectedProductVariantId(null);
      refetchProductVariants();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý biến thể sản phẩm</Typography>

      <ProductVariantToolbar
        handleRefresh={handleRefresh}
        selectedProductId={selectedProductId}
        setSelectedProductId={setSelectedProductId}
        refetchProduct={refetchProduct}
        dataProducts={dataProducts}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />

      <TableData
        rows={dataRowProductVariants}
        totalRows={totalRows}
        columnsData={columnsProductVariant}
        loading={isLoadingProductVariant}
        error={
          isErrorProductVariant && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorProductVariant} || Không tải được dữ liệu.
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
      />

      <ProductVariantEditDialog
        openEditDialog={openEditDialog}
        closeEditDialog={() => setOpenEditDialog(false)}
        handleUpdateProductVariant={handleUpdateProductVariant}
        newProductVariant={newProductVariant}
        setNewProductVariant={setNewProductVariant}
        submitted={submitted}
      />

      <ProductVariantDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteProductVariant}
      />

      <ProductVariantRestoreDialog
        open={openRestoreDialog}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleRestoreProductVariant}
      />
    </DashboardLayoutWrapper>
  );
};

export default ProductVariantManagement;
