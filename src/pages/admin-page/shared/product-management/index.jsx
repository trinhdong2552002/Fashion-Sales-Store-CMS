import { Fragment, useEffect, useMemo, useState } from "react";
import { Typography, IconButton, Box } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/dashboard-layout";
import {
  useGetAllProductsByAdminQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} from "@/services/api/product";
import { useGetAllCategoriesByAdminQuery } from "@/services/api/category";
import TableData from "@/components/table-data";
import { Delete, Edit, Restore, Visibility } from "@mui/icons-material";
import { useSnackbar } from "@/components/Snackbar";
import { normalizeSearchString } from "@/utils/stringUtils";
import StatusChip from "@/components/status-chip";

import ProductAddDialog from "./shared/product-add-dialog";
import ProductSeeDetailDialog from "./shared/product-see-detail-dialog";
import ProductRestoreDialog from "./shared/product-restore-dialog";
import ProductDialogSeeDetail from "./shared/product-see-detail-dialog";
import ProductEditDialog from "./shared/product-edit-dialog";

import { useGetAllFilesQuery } from "@/services/api/file";
import { useGetAllColorsQuery } from "@/services/api/color";
import { useGetAllSizesQuery } from "@/services/api/size";
import ProductDeleteDialog from "./shared/product-delete-dialog";
import ProductToolbar from "./shared/product-toolbar";

const ProductManagement = () => {
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
    pageSize: 25,
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
    imageIds: [],
    variants: [
      {
        colorId: "",
        sizeId: "",
        price: "",
        quantity: "",
      },
    ],
  });

  const {
    data: dataProducts,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    refetch: refetchProducts,
  } = useGetAllProductsByAdminQuery(
    {
      page: 0,
      size: 1000,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [restoreProduct] = useRestoreProductMutation();

  const { data: dataCategories, refetch: refetchCategories } =
    useGetAllCategoriesByAdminQuery(
      { page: 0, size: 100 },
      {
        refetchOnMountOrArgChange: true,
      },
    );

  const { data: dataColors, refetch: refetchColors } = useGetAllColorsQuery(
    { page: 0, size: 100 },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: dataSizes } = useGetAllSizesQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: dataImages, refetch: refetchImages } = useGetAllFilesQuery(
    { page: 0, size: 100 },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const dataRowProducts = dataProducts?.result?.items || [];

  const filteredProducts = useMemo(() => {
    if (!searchValue) return dataRowProducts;

    const normalizedSearch = normalizeSearchString(searchValue);

    return dataRowProducts.filter((product) => {
      if (!product.name) return false;
      // Convert product name to normalized string before comparing
      return normalizeSearchString(product.name).includes(normalizedSearch);
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
        return <StatusChip status={params.value} />;
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
    showSnackbar("Danh sách sản phẩm đã được làm mới!", "info");
  };

  const handleAddProduct = async () => {
    setSubmitted(true);

    const formattedVariants = [];

    if (newProduct.colorIds && newProduct.sizeIds) {
      newProduct.colorIds.forEach((colorId) => {
        newProduct.sizeIds.forEach((sizeId) => {
          formattedVariants.push({
            colorId,
            sizeId,
            price: newProduct.price,
            quantity: newProduct.quantity,
          });
        });
      });
    }

    const payloadProduct = {
      name: newProduct.name,
      description: newProduct.description,
      categoryId: newProduct.categoryId,
      imageIds: newProduct.imageIds,
      variants: formattedVariants,
    };

    try {
      await createProduct(payloadProduct).unwrap();
      showSnackbar("Thêm sản phẩm thành công!", "success");
      setNewProduct({
        name: "",
        description: "",
        categoryId: "",
        imageIds: [],
        colorIds: [],
        sizeIds: [],
        price: "",
        quantity: "",
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

    if (productToEdit) {
      // Extract category ID
      const categoryId =
        productToEdit.category?.id || productToEdit.categoryId || "";

      // Extract image IDs from images array
      const imageIds =
        productToEdit.images?.map((image) => image.id) ||
        productToEdit.imageIds ||
        [];

      setNewProduct({
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        categoryId: categoryId,
        imageIds: imageIds,
        images: productToEdit.images || [],
      });

      setSelectedProductId(id);
      setOpenEditDialog(true);
    }
  };

  const handleUpdateProduct = async () => {
    setSubmitted(true);

    try {
      await updateProduct({
        productId: selectedProductId,
        ...newProduct,
      });
      showSnackbar("Cập nhật sản phẩm thành công!", "success");
      setNewProduct({
        name: "",
        description: "",
        categoryId: "",
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
      await deleteProduct({ productId: selectedProductId }).unwrap();
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
      await restoreProduct({ productId: selectedProductId }).unwrap();
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

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý sản phẩm</Typography>

      <ProductToolbar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onCreateProduct={() => {
          setOpenAddDialog(true);
          setNewProduct({
            name: "",
            description: "",
            categoryId: "",
            imageIds: [],
            variants: [
              {
                colorId: "",
                sizeId: "",
                price: "",
                quantity: "",
              },
            ],
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
        error={
          isErrorProducts && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorProducts} || Không tải được dữ liệu.
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
      />

      <ProductAddDialog
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

      <ProductEditDialog
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

      <ProductDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteProduct}
      />

      <ProductRestoreDialog
        open={openRestoreDialog}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleRestoreProduct}
      />

      <ProductSeeDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        product={selectedProduct}
      />
    </DashboardLayoutWrapper>
  );
};

export default ProductManagement;
