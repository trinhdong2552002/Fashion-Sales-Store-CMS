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
import { Delete, Edit, Restore, Visibility } from "@mui/icons-material";
import { statusDisplay } from "/src/constants/badgeStatus";
import { useListColorsQuery } from "@/services/api/color";
import { useListSizesQuery } from "@/services/api/size";
import { useListImagesQuery } from "../../../../services/api/productImage";
import ProductDialogDetail from "./shared/ProductDialogDetail";
import { useSearchProductsQuery } from "@/services/api/product";

const ProductsManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    price: "",
    quantity: "",
    categoryId: "",
    colorIds: [],
    sizeIds: [],
    imageIds: [],
  });
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
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // TODO: Need search product for admin
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

  const { data: dataCategories, refetch: refetchCategories } =
    useListCategoriesForAdminQuery(
      { pageNo: 1, pageSize: 100 },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const { data: dataColors, refetch: refetchColors } = useListColorsQuery(
    { pageNo: 1, pageSize: 100 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: dataSizes } = useListSizesQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: dataImages, refetch: refetchImages } = useListImagesQuery(
    { pageNo: 1, pageSize: 100 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const dataRowProducts = dataProducts?.result?.items || [];
  search.length > 0
    ? dataSearchProducts?.result?.items || []
    : dataProducts?.result?.items || [];

  const totalRows = dataProducts?.result?.totalItems || 0;
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
    {
      field: "isAvailable",
      headerName: "Sản phẩm có sẵn",
      width: 150,
      renderCell: (params) => (
        <>{params.row.isAvailable === true ? "Có sẵn" : "Không có sẵn"}</>
      ),
    },
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
          <IconButton onClick={() => handleOpenDetailDialog(params.row.id)}>
            <Visibility color="success" />
          </IconButton>

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
      }).unwrap();
      setSnackbar({
        open: true,
        message: "Thêm sản phẩm thành công!",
        severity: "success",
      });
      setNewProduct({
        name: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "",
        colorIds: [],
        sizeIds: [],
        imageIds: [],
      });

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
      // Extract category ID
      const categoryId =
        productToEdit.category?.id || productToEdit.categoryId || "";

      // Extract color IDs from colors array
      const colorIds =
        productToEdit.colors?.map((color) => color.id) ||
        productToEdit.colorIds ||
        [];

      // Extract size IDs from sizes array
      const sizeIds =
        productToEdit.sizes?.map((size) => size.id) ||
        productToEdit.sizeIds ||
        [];

      // Extract image IDs from images array
      const imageIds =
        productToEdit.images?.map((image) => image.id) ||
        productToEdit.imageIds ||
        [];

      setNewProduct({
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        price: productToEdit.price || "",
        quantity: productToEdit.quantity || "",
        categoryId: categoryId,
        colorIds: colorIds,
        sizeIds: sizeIds,
        imageIds: imageIds,
      });

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
      });
      setSnackbar({
        open: true,
        message: "Cập nhật sản phẩm thành công!",
        severity: "success",
      });
      setNewProduct({
        name: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "",
        colorIds: [],
        sizeIds: [],
        imageIds: [],
      });

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

  const handleOpenDetailDialog = (id) => {
    const product = dataRowProducts.find((item) => item.id === id);
    setSelectedProduct(product);
    setOpenDetailDialog(true);
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
        onSearch={setSearch}
        onAddProduct={() => {
          setOpenAddDialog(true);
          setNewProduct({
            name: "",
            description: "",
            price: "",
            quantity: "",
            categoryId: "",
            colorIds: [],
            sizeIds: [],
            imageIds: [],
          });
          refetchCategories();
          refetchColors();
          refetchImages();
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
        submitted={submitted}
        dataCategories={dataCategories}
        dataColors={dataColors}
        dataSizes={dataSizes}
        dataImages={dataImages}
      />

      <ProductDialogEdit
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={handleUpdateProduct}
        product={newProduct}
        setProduct={setNewProduct}
        submitted={submitted}
        dataCategories={dataCategories}
        dataColors={dataColors}
        dataSizes={dataSizes}
        dataImages={dataImages}
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

      <ProductDialogDetail
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        product={selectedProduct}
      />

      <SnackbarComponent snackbar={snackbar} onClose={handleCloseSnackbar} />
    </DashboardLayoutWrapper>
  );
};

export default ProductsManagement;
