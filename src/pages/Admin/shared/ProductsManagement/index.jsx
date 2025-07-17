import { useMemo, useState } from "react";
import { Typography, Box } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListProductsForAdminQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} from "@/services/api/product";
import { useListCategoriesForAdminQuery } from "@/services/api/categories";
import ErrorDisplay from "@/components/ErrorDisplay";
import ProductTable from "./shared/ProductTable";
import ProductToolbar from "./shared/ProductToolbar";
import ProductDialogAdd from "./shared/ProductDialogAdd";
import ProductDialogEdit from "./shared/ProductDialogEdit";
import ProductDialogDelete from "./shared/ProductDialogDelete";
import ProductDialogRestore from "./shared/ProductDialogRestore";
import SnackbarComponent from "@/components/Snackbar";

const ProductsManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
  });
  const [variants, setVariants] = useState([
    {
      price: "",
      quantity: "",
      colorId: "",
      sizeId: "",
      imageId: "",
    },
  ]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    data: dataProducts,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    refetch: refetchProducts,
  } = useListProductsForAdminQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [restoreProduct] = useRestoreProductMutation();

  const { data: dataCategories } = useListCategoriesForAdminQuery({
    refetchOnMountOrArgChange: true,
  });

  const filteredProducts = useMemo(() => {
    let filtered = dataProducts?.result?.items || [];

    // Filter theo status
    if (selectedStatus) {
      filtered = filtered.filter(
        (product) => product.status === selectedStatus
      );
    }

    // // Filter theo search text
    if (searchText) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          product.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  }, [dataProducts?.result?.items, selectedStatus, searchText]);

  const dataRowProducts = filteredProducts;
  const totalRows = filteredProducts.length;

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedProductId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedProductId(null);
    setOpenDeleteDialog(false);
  };

  const handleOpenRestoreDialog = (id) => {
    setSelectedProductId(id);
    setOpenRestoreDialog(true);
  };

  const handleCloseRestoreDialog = () => {
    setSelectedProductId(null);
    setOpenRestoreDialog(false);
  };

  const handleRefresh = () => {
    refetchProducts();
    setSnackbar({
      open: true,
      message: "Danh sách sản phẩm đã được làm mới!",
      severity: "info",
    });
  };

  const handleAddProduct = async () => {
    setSubmitted(true);

    try {
      await addProduct({
        ...newProduct,
        variants,
      }).unwrap();
      setSnackbar({
        open: true,
        message: "Thêm sản phẩm thành công!",
        severity: "success",
      });
      setNewProduct({
        name: "",
        description: "",
        categoryId: "",
      });
      setVariants([
        {
          price: "",
          quantity: "",
          colorId: "",
          sizeId: "",
          imageId: "",
        },
      ]);
      setOpenAddDialog(false);
      setSubmitted(false);
      refetchProducts();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  const handleEditProduct = (id) => {
    const productToEdit = dataRowProducts.find((item) => item.id === id);
    console.log("Product to edit:", productToEdit);

    if (productToEdit) {
      setNewProduct({
        name: productToEdit.name,
        description: productToEdit.description,
        categoryId: productToEdit.categoryId,
      });
      setVariants(
        productToEdit.variants.map((variant) => ({
          price: variant.price,
          quantity: variant.quantity,
          colorId: variant.colorId,
          sizeId: variant.sizeId,
          imageId: variant.imageUrl,
        })) || []
      );
      setSelectedProductId(id);
      setOpenEditDialog(true);
    }
  };

  const handleUpdateProduct = async () => {
    setSubmitted(true);

    try {
      await updateProduct({
        id: selectedProductId,
        ...newProduct,
        variants,
      });
      setSnackbar({
        open: true,
        message: "Cập nhật sản phẩm thành công!",
        severity: "success",
      });
      setNewProduct({ name: "", description: "", categoryId: "" });
      setVariants([
        {
          price: "",
          quantity: "",
          colorId: "",
          sizeId: "",
          imageId: "",
        },
      ]);
      setSelectedProductId(null);
      setOpenEditDialog(false);
      setSubmitted(false);
      refetchProducts();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct({ id: selectedProductId }).unwrap();
      setSnackbar({
        open: true,
        message: "Xóa sản phẩm thành công!",
        severity: "success",
      });
      setOpenDeleteDialog(false);
      setSelectedProductId(null);
      refetchProducts();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  const handleRestoreProduct = async () => {
    try {
      await restoreProduct({ id: selectedProductId }).unwrap();
      setSnackbar({
        open: true,
        message: "Khôi phục sản phẩm thành công!",
        severity: "success",
      });
      setOpenRestoreDialog(false);
      setSelectedProductId(null);
      refetchProducts();
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  if (isErrorProducts)
    return (
      <ErrorDisplay
        error={{
          message:
            "Không tải được danh sách sản phẩm. Vui lòng kiểm tra kết nối của bạn và thử lại !",
        }}
      />
    );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Sản phẩm</Typography>

      <ProductToolbar
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onSearch={setSearchText}
        onAddProduct={() => {
          setOpenAddDialog(true);
          setNewProduct({ name: "", description: "", categoryId: "" });
        }}
        onRefresh={handleRefresh}
      />

      <Box height={600}>
        <ProductTable
          rows={dataRowProducts}
          totalRows={totalRows}
          loading={isLoadingProducts}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onEdit={handleEditProduct}
          onDelete={handleOpenDeleteDialog}
          onRestore={handleOpenRestoreDialog}
        />
      </Box>

      <ProductDialogAdd
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddProduct}
        product={newProduct}
        setProduct={setNewProduct}
        variants={variants}
        setVariants={setVariants}
        submitted={submitted}
        categories={dataCategories}
      />

      <ProductDialogEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={handleUpdateProduct}
        product={newProduct}
        setProduct={setNewProduct}
        variants={variants}
        setVariants={setVariants}
        submitted={submitted}
        categories={dataCategories}
      />

      <ProductDialogDelete
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteProduct}
      />

      <ProductDialogRestore
        open={openRestoreDialog}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleRestoreProduct}
      />

      <SnackbarComponent snackbar={snackbar} onClose={handleCloseSnackbar} />
    </DashboardLayoutWrapper>
  );
};

export default ProductsManagement;
