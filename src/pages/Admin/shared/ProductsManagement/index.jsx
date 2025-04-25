import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Box,
  FormHelperText,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/services/api/product";
import { useListCategoriesQuery } from "@/services/api/categories";
import { useListColorsQuery } from "@/services/api/color";
import { useListSizesQuery } from "@/services/api/size";
import { useListImagesQuery } from "@/services/api/productImage";
import { useGetMyInfoQuery } from "@/services/api/auth";

const ProductsManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [products, setProducts] = useState([]);
  const [filteredTotalRows, setFilteredTotalRows] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ACTIVE");

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    colors: [],
    sizeIds: [],
    imageIds: [],
    status: "ACTIVE",
  });
  const [editProduct, setEditProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch data from API
  const {
    data: userInfo,
    error: userError,
    isLoading: userLoading,
  } = useGetMyInfoQuery();
  const {
    data: productsData,
    isLoading: isFetchingProducts,
    error: fetchProductsError,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useListProductsQuery(
    {
      categoryId: selectedCategory || undefined,
      status: selectedStatus || undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: categoriesData,
    isLoading: isFetchingCategories,
    error: fetchCategoriesError,
  } = useListCategoriesQuery();
  const {
    data: colorsData,
    isLoading: isFetchingColors,
    error: fetchColorsError,
  } = useListColorsQuery();
  const {
    data: sizesData,
    isLoading: isFetchingSizes,
    error: fetchSizesError,
  } = useListSizesQuery({ pageNo: 1, pageSize: 50 });
  const {
    data: imagesData,
    isLoading: isFetchingImages,
    error: fetchImagesError,
  } = useListImagesQuery({ pageNo: 1, pageSize: 50 });

  // Sử dụng RTK Query mutations
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Log dữ liệu từ API để kiểm tra
  useEffect(() => {
    console.log("Raw Products Data from API:", productsData);
    console.log("Colors Data from API:", colorsData);
    console.log("Categories Data from API:", categoriesData);
    console.log("Sizes Data from API:", sizesData);
    console.log("Images Data from API:", imagesData);
  }, [productsData, colorsData, categoriesData, sizesData, imagesData]);

  // Update products when productsData or selectedCategory changes
  useEffect(() => {
    if (productsData?.items) {
      let filteredProducts = productsData.items;

      // Lọc theo categoryId
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
          (item) => item.category?.id === parseInt(selectedCategory)
        );
      }

      // Không cần lọc status trên frontend vì backend đã xử lý thông qua tham số status
      const updatedProducts = filteredProducts.map((item) => {
        console.log("Processing item:", item);
        return {
          id: item.id,
          name: item.name,
          description: item.description || "",
          averageRating: item.averageRating || 0,
          soldQuantity: item.soldQuantity || 0,
          totalReviews: item.totalReviews || 0,
          quantity: item.quantity || 0,
          price: item.price || 0,
          createdBy: item.createdBy || "N/A",
          updatedBy: item.updatedBy || "N/A",
          createdAt: item.createdAt || "",
          updatedAt: item.updatedAt || "",
          category: item.category || { id: null, name: "N/A" },
          colors: item.colors || [],
          sizes: item.sizes || [],
          productImages: item.productImages || [],
          status: item.status || "N/A",
        };
      });
      console.log("Filtered Products:", filteredProducts);
      console.log("Updated Products before set:", updatedProducts);
      setProducts(updatedProducts);
      setFilteredTotalRows(filteredProducts.length);
      console.log("State Products after set:", updatedProducts);
    } else {
      setProducts([]);
      setFilteredTotalRows(0);
      console.log("No products found in API response.");
    }
  }, [productsData, selectedCategory]);

  // Force refetch on mount
  useEffect(() => {
    refetchProducts();
  }, [refetchProducts]);

  // Handle product errors
  useEffect(() => {
    if (fetchProductsError || isProductsError) {
      const errorMessage =
        fetchProductsError?.data?.message ||
        fetchProductsError?.error ||
        "Lỗi khi tải sản phẩm";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      if (fetchProductsError?.status === 401) {
        setSnackbar({
          open: true,
          message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
          severity: "error",
        });
        setTimeout(() => navigate("/login"), 2000);
      }
    } else if (products.length === 0 && productsData?.items?.length === 0) {
      setSnackbar({
        open: true,
        message: "Hiện tại không có sản phẩm nào.",
        severity: "info",
      });
    }
  }, [fetchProductsError, isProductsError, productsData, products, navigate]);

  useEffect(() => {
    if (fetchCategoriesError) {
      setSnackbar({
        open: true,
        message:
          "Lỗi khi tải danh mục: " +
          (fetchCategoriesError?.data?.message || "Không xác định"),
        severity: "error",
      });
    }
    if (fetchColorsError) {
      setSnackbar({
        open: true,
        message:
          "Lỗi khi tải màu sắc: " +
          (fetchColorsError?.data?.message || "Không xác định"),
        severity: "error",
      });
    }
    if (fetchSizesError) {
      setSnackbar({
        open: true,
        message:
          "Lỗi khi tải kích thước: " +
          (fetchSizesError?.data?.message || "Không xác định"),
        severity: "error",
      });
    }
    if (fetchImagesError) {
      setSnackbar({
        open: true,
        message:
          "Lỗi khi tải hình ảnh: " +
          (fetchImagesError?.data?.message || "Không xác định"),
        severity: "error",
      });
    }
  }, [
    fetchCategoriesError,
    fetchColorsError,
    fetchSizesError,
    fetchImagesError,
  ]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên", width: 150 },
    { field: "description", headerName: "Mô tả", width: 200 },
    {
      field: "averageRating",
      headerName: "Đánh giá trung bình",
      width: 150,
      type: "number",
    },
    {
      field: "soldQuantity",
      headerName: "Số lượng đã bán",
      width: 150,
      type: "number",
    },
    {
      field: "totalReviews",
      headerName: "Tổng đánh giá",
      width: 120,
      type: "number",
    },
    {
      field: "quantity",
      headerName: "Số lượng tồn",
      width: 120,
      type: "number",
    },
    {
      field: "price",
      headerName: "Giá",
      width: 120,
      type: "number",
    },
    {
      field: "createdBy",
      headerName: "Người tạo",
      width: 150,
    },
    {
      field: "updatedBy",
      headerName: "Người cập nhật",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 150,
      renderCell: (params) =>
        params.row.createdAt
          ? new Date(params.row.createdAt).toLocaleDateString("vi-VN")
          : "N/A",
    },
    {
      field: "updatedAt",
      headerName: "Ngày cập nhật",
      width: 150,
      renderCell: (params) =>
        params.row.updatedAt
          ? new Date(params.row.updatedAt).toLocaleDateString("vi-VN")
          : "N/A",
    },
    {
      field: "category",
      headerName: "Danh mục",
      width: 150,
      renderCell: (params) => params.row.category?.name || "N/A",
    },
    {
      field: "colors",
      headerName: "Màu sắc",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {params.row.colors?.map((color) => (
            <Chip key={color.id} label={color.name} size="small" />
          ))}
        </Box>
      ),
    },
    {
      field: "sizes",
      headerName: "Kích thước",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {params.row.sizes?.map((size) => (
            <Chip key={size.id} label={size.name} size="small" />
          ))}
        </Box>
      ),
    },
    {
      field: "productImages",
      headerName: "Hình ảnh",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {params.row.productImages?.map((image) => (
            <img
              key={image.id}
              src={image.imageUrl}
              alt={image.fileName}
              style={{
                width: 30,
                height: 30,
                objectFit: "cover",
                marginRight: 5,
              }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="text"
            color="primary"
            onClick={() => handleEditProduct(params.row)}
          >
            Sửa
          </Button>
          <Button
            variant="text"
            color="error"
            onClick={() => handleOpenDeleteDialog(params.row.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setNewProduct({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      quantity: product.quantity?.toString() || "",
      categoryId: product.category?.id || "",
      colors: product.colors?.map((color) => color.id) || [],
      sizeIds: product.sizes?.map((size) => size.id) || [],
      imageIds: product.productImages?.map((image) => image.id) || [],
      status: product.status === "N/A" ? "ACTIVE" : product.status,
    });
    setOpenDialog(true);
  };

  const handleOpenAddProductDialog = () => {
    setEditProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      quantity: "",
      categoryId: "",
      colors: [],
      sizeIds: [],
      imageIds: [],
      status: "ACTIVE",
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      quantity: "",
      categoryId: "",
      colors: [],
      sizeIds: [],
      imageIds: [],
      status: "ACTIVE",
    });
    setFormErrors({});
  };

  const validateProductData = (product) => {
    const errors = {};
    if (!product.name.trim()) errors.name = "Tên sản phẩm không được để trống";
    if (!product.description.trim())
      errors.description = "Mô tả sản phẩm không được để trống";
    if (!product.price || isNaN(parseFloat(product.price)))
      errors.price = "Giá không hợp lệ";
    if (!product.quantity || isNaN(parseInt(product.quantity)))
      errors.quantity = "Số lượng không hợp lệ";
    if (!product.categoryId) errors.categoryId = "Danh mục không được để trống";
    if (!product.colors || product.colors.length === 0)
      errors.colors = "Phải chọn ít nhất một màu sắc";
    if (!product.sizeIds || product.sizeIds.length === 0)
      errors.sizeIds = "Phải chọn ít nhất một kích thước";
    if (!product.imageIds || product.imageIds.length === 0)
      errors.imageIds = "Phải chọn ít nhất một hình ảnh";
    return errors;
  };

  const handleAddProduct = async () => {
    const errors = validateProductData(newProduct);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSnackbar({
        open: true,
        message: Object.values(errors).join(". "),
        severity: "error",
      });
      return;
    }

    try {
      await addProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        categoryId: parseInt(newProduct.categoryId),
        colorIds: newProduct.colors.map((colorId) => parseInt(colorId)),
        sizeIds: newProduct.sizeIds.map((sizeId) => parseInt(sizeId)),
        imageIds: newProduct.imageIds.map((imageId) => parseInt(imageId)),
        status: newProduct.status,
      }).unwrap();
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Thêm sản phẩm thành công!",
        severity: "success",
      });
      refetchProducts();
    } catch (error) {
      const errorMessage = Array.isArray(error.data?.errors)
        ? error.data.errors.join(". ")
        : error.data?.message || "Lỗi khi thêm sản phẩm";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleUpdateProduct = async () => {
    const errors = validateProductData(newProduct);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSnackbar({
        open: true,
        message: Object.values(errors).join(". "),
        severity: "error",
      });
      return;
    }

    try {
      const payload = {
        id: editProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        categoryId: parseInt(newProduct.categoryId),
        colorIds: newProduct.colors.map((colorId) => parseInt(colorId)),
        sizeIds: newProduct.sizeIds.map((sizeId) => parseInt(sizeId)),
        imageIds: newProduct.imageIds.map((imageId) => parseInt(imageId)),
        status: newProduct.status,
      };
      await updateProduct(payload).unwrap();
      setSnackbar({
        open: true,
        message: "Cập nhật sản phẩm thành công!",
        severity: "success",
      });
      handleCloseDialog();
      refetchProducts();
    } catch (error) {
      const errorMessage =
        error.status === 400
          ? "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại các trường bắt buộc!"
          : error.status === 404
          ? "Backend không có endpoint PUT /adamstore/v1/products/:id. Vui lòng liên hệ team backend!"
          : error.status === 405
          ? "Backend không hỗ trợ phương thức PUT. Vui lòng liên hệ team backend!"
          : Array.isArray(error.data?.errors)
          ? error.data.errors.join(". ")
          : error.data?.message || "Lỗi khi cập nhật sản phẩm";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setProductToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(productToDelete).unwrap();
      setOpenDeleteDialog(false);
      setProductToDelete(null);
      setSnackbar({
        open: true,
        message: "Xóa sản phẩm thành công!",
        severity: "success",
      });
      refetchProducts();
    } catch (error) {
      const errorMessage = Array.isArray(error.data?.errors)
        ? error.data.errors.join(". ")
        : error.data?.message || "Lỗi khi xóa sản phẩm";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (
    userLoading ||
    isFetchingProducts ||
    isFetchingCategories ||
    isFetchingColors ||
    isFetchingSizes ||
    isFetchingImages
  ) {
    return <CircularProgress />;
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Sản phẩm
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(0);
                refetchProducts();
              }}
              label="Danh mục"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {Array.isArray(categoriesData) && categoriesData.length > 0 ? (
                categoriesData.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Không có danh mục</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(0);
                refetchProducts();
              }}
              label="Trạng thái"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => refetchProducts()}
            fullWidth
          >
            Làm mới
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddProductDialog}
            fullWidth
          >
            Thêm sản phẩm
          </Button>
        </Grid>
      </Grid>

      {fetchProductsError ? (
        <Alert severity="error">
          {fetchProductsError?.data?.message || "Lỗi khi tải sản phẩm"}
        </Alert>
      ) : products.length === 0 ? (
        <Alert severity="info">Hiện tại không có sản phẩm nào.</Alert>
      ) : (
        <>
          <Typography variant="body1" gutterBottom>
            Tổng số sản phẩm trong state: {products.length}
          </Typography>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={products}
              columns={columns}
              rowCount={filteredTotalRows}
              paginationMode="client" // Chuyển sang client-side pagination
              page={page}
              onPageChange={(newPage) => setPage(newPage)}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => {
                setPageSize(newPageSize);
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20]}
              sortingMode="client" // Chuyển sang client-side sorting
              getRowId={(row) => row.id}
              disableSelectionOnClick
              aria-label="Bảng sản phẩm"
              localeText={{
                noRowsLabel: "Không có dữ liệu",
              }}
            />
          </div>
        </>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            label="Mô tả"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
            error={!!formErrors.description}
            helperText={formErrors.description}
          />
          <TextField
            label="Giá"
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
            error={!!formErrors.price}
            helperText={formErrors.price}
          />
          <TextField
            label="Số lượng"
            type="number"
            value={newProduct.quantity}
            onChange={(e) =>
              setNewProduct({ ...newProduct, quantity: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
            error={!!formErrors.quantity}
            helperText={formErrors.quantity}
          />
          <FormControl fullWidth sx={{ mt: 2 }} required>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={newProduct.categoryId || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, categoryId: e.target.value })
              }
              label="Danh mục"
              error={!!formErrors.categoryId}
            >
              {Array.isArray(categoriesData) && categoriesData.length > 0 ? (
                categoriesData.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Không có danh mục</MenuItem>
              )}
            </Select>
            {formErrors.categoryId && (
              <FormHelperText error>{formErrors.categoryId}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }} required>
            <InputLabel>Màu sắc</InputLabel>
            <Select
              multiple
              value={newProduct.colors || []}
              onChange={(e) => {
                console.log("Selected colors:", e.target.value);
                setNewProduct({ ...newProduct, colors: e.target.value });
              }}
              label="Màu sắc"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const color = colorsData?.items?.find(
                      (c) => c.id === value
                    );
                    return <Chip key={value} label={color?.name || value} />;
                  })}
                </Box>
              )}
              disabled={isFetchingColors || !colorsData?.items}
              error={!!formErrors.colors}
            >
              {Array.isArray(colorsData?.items) &&
              colorsData.items.length > 0 ? (
                colorsData.items.map((color) => (
                  <MenuItem key={color.id} value={color.id}>
                    {color.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Không có màu sắc</MenuItem>
              )}
            </Select>
            {formErrors.colors && (
              <FormHelperText error>{formErrors.colors}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }} required>
            <InputLabel>Kích thước</InputLabel>
            <Select
              multiple
              value={newProduct.sizeIds || []}
              onChange={(e) =>
                setNewProduct({ ...newProduct, sizeIds: e.target.value })
              }
              label="Kích thước"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const size = sizesData?.items?.find((s) => s.id === value);
                    return <Chip key={value} label={size?.name || value} />;
                  })}
                </Box>
              )}
              disabled={isFetchingSizes || !sizesData?.items}
              error={!!formErrors.sizeIds}
            >
              {Array.isArray(sizesData?.items) && sizesData.items.length > 0 ? (
                sizesData.items.map((size) => (
                  <MenuItem key={size.id} value={size.id}>
                    {size.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Không có kích thước</MenuItem>
              )}
            </Select>
            {formErrors.sizeIds && (
              <FormHelperText error>{formErrors.sizeIds}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }} required>
            <InputLabel>Hình ảnh</InputLabel>
            <Select
              multiple
              value={newProduct.imageIds || []}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageIds: e.target.value })
              }
              label="Hình ảnh"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const image = imagesData?.find((img) => img.id === value);
                    return (
                      <Chip key={value} label={image?.fileName || value} />
                    );
                  })}
                </Box>
              )}
              disabled={isFetchingImages || !imagesData}
              error={!!formErrors.imageIds}
            >
              {Array.isArray(imagesData) && imagesData.length > 0 ? (
                imagesData.map((image) => (
                  <MenuItem key={image.id} value={image.id}>
                    {image.fileName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Không có hình ảnh</MenuItem>
              )}
            </Select>
            {formErrors.imageIds && (
              <FormHelperText error>{formErrors.imageIds}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={newProduct.status}
              onChange={(e) =>
                setNewProduct({ ...newProduct, status: e.target.value })
              }
              label="Trạng thái"
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={editProduct ? handleUpdateProduct : handleAddProduct}
            variant="contained"
            color="primary"
          >
            {editProduct ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa sản phẩm này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenDeleteDialog(false)}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProduct}
          >
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

export default ProductsManagement;