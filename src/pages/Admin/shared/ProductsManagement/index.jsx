import { Fragment, useEffect, useMemo, useState } from "react";
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
import TableData from "@/components/TableData";
import { Delete, Edit, Restore, Visibility } from "@mui/icons-material";
import { statusDisplay } from "/src/constants/badgeStatus";
import { useListColorsQuery } from "@/services/api/color";
import { useListSizesQuery } from "@/services/api/size";
import { useListImagesQuery } from "@/services/api/productImage";
import ProductDialogDetail from "./shared/ProductDialogDetail";

import { useSnackbar } from "@/components/Snackbar";

// Vietnamese character encoding normalization for search
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD") // Split accents from letters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const ProductsManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
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

  const {
    data: dataProducts,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    refetch: refetchProducts,
  } = useListProductsForAdminQuery(
    {
      pageNo: 1,
      pageSize: 1000,
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

  const filteredProducts = useMemo(() => {
    if (!searchValue) return dataRowProducts;

    const normalizedSearch = normalizeString(searchValue);

    return dataRowProducts.filter((product) => {
      if (!product.name) return false;
      // Convert product name to normalized string before comparing
      return normalizeString(product.name).includes(normalizedSearch);
    });
  }, [dataRowProducts, searchValue]);

  const totalRows = filteredProducts.length;

  useEffect(() => {
    if (searchValue) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [searchValue]);

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
    showSnackbar("Làm mới danh sách sản phẩm thành công!", "info");
  };

  const handleAddProduct = async () => {
    setSubmitted(true);

    try {
      await addProduct({
        ...newProduct,
      }).unwrap();
      showSnackbar("Thêm sản phẩm thành công!", "success");
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
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
        return;
      }
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
      showSnackbar("Cập nhật sản phẩm thành công!", "success");
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
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
        return;
      }
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct({ id: selectedProductId }).unwrap();
      showSnackbar("Xóa sản phẩm thành công!", "success");
      setOpenDeleteDialog(false);
      setSelectedProductId(null);
      refetchProducts();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
        return;
      }
    }
  };

  const handleRestoreProduct = async () => {
    try {
      await restoreProduct({ id: selectedProductId }).unwrap();
      showSnackbar("Khôi phục sản phẩm thành công!", "success");
      setOpenRestoreDialog(false);
      setSelectedProductId(null);
      refetchProducts();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
        return;
      }
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
        searchValue={searchValue}
        setSearchValue={setSearchValue}
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
        rows={filteredProducts}
        totalRows={totalRows}
        columnsData={columnsProduct}
        loading={isLoadingProducts}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[20, 50, 100]}
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
    </DashboardLayoutWrapper>
  );
};

export default ProductsManagement;
