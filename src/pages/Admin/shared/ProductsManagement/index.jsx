import { Fragment, useState } from "react";
import { Typography, IconButton, Chip } from "@mui/material";
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
import ProductToolbar from "./shared/ProductToolbar";
import ProductDialogAdd from "./shared/ProductDialogAdd";
import ProductDialogEdit from "./shared/ProductDialogEdit";
import ProductDialogDelete from "./shared/ProductDialogDelete";
import ProductDialogRestore from "./shared/ProductDialogRestore";
import SnackbarComponent from "@/components/Snackbar";
import TableData from "@/components/TableData";
import { Delete, Edit, Restore } from "@mui/icons-material";
import { statusDisplay } from "/src/constants/badgeStatus";
import { useSearchProductsQuery } from "@/services/api/product";

const ProductsManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");
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

  // Đang dùng tạm api tìm kiếm sản phẩm cho user, vì lấy danh sách sản phẩm cho admin thiếu field search
  const { data: dataSearchProducts } = useSearchProductsQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
      search,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [restoreProduct] = useRestoreProductMutation();

  const {
    data: dataCategories,
    isError: isErrorCategories,
    refetch: refetchCategories,
  } = useListCategoriesForAdminQuery(
    { page: 0, size: 100 },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  console.log(dataCategories);

  const dataRowProducts =
    search.length > 0
      ? dataSearchProducts?.result?.items || []
      : dataProducts?.result?.items || [];

  const totalRows =
    search.length > 0
      ? dataSearchProducts?.result?.totalItems || 0
      : dataProducts?.result?.totalItems || 0;

  const columnsProduct = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên sản phẩm", width: 400 },
    {
      field: "description",
      headerName: "Mô tả",
      width: 500,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.description || "--"}
        </div>
      ),
    },
    { field: "isAvailable", headerName: "Có sẵn", width: 150 },
    { field: "averageRating", headerName: "Đánh giá trung bình", width: 150 },
    { field: "soldQuantity", headerName: "Số lượng đã bán", width: 150 },
    { field: "totalReviews", headerName: "Tổng đánh giá", width: 150 },
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
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <Fragment>
          <IconButton onClick={() => handleEditProduct(params.row.id)}>
            <Edit color="primary" />
          </IconButton>
          {params.row.status === "INACTIVE" ? (
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

  if (isErrorCategories)
    return (
      <ErrorDisplay
        error={{
          message:
            "Không thể tải danh mục sản phẩm. Vui lòng thử lại sau hoặc kiểm tra kết nối!",
        }}
      />
    );

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
        onSearch={setSearch}
        onAddProduct={() => {
          setOpenAddDialog(true);
          setNewProduct({ name: "", description: "", categoryId: "" });
          refetchCategories();
        }}
        onRefresh={handleRefresh}
      />

      <TableData
        rows={dataRowProducts}
        totalRows={totalRows}
        columnsData={columnsProduct}
        loading={isLoadingProducts}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 15, 20]}
      />

      <ProductDialogAdd
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddProduct}
        product={newProduct}
        setProduct={setNewProduct}
        variants={variants}
        setVariants={setVariants}
        submitted={submitted}
        dataCategories={dataCategories}
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
        dataCategories={dataCategories}
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
