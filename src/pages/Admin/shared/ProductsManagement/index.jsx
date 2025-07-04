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
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListProductsForAdminQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
} from "@/services/api/product";
import { useListCategoriesForAdminQuery } from "@/services/api/categories";
import { useListColorsQuery } from "@/services/api/color";
import { useListSizesQuery } from "@/services/api/size";
import {
  useListImagesQuery,
  useLazyListImagesQuery,
} from "@/services/api/productImage";
import { useGetMyInfoQuery } from "@/services/api/auth";
import CustomPaginationItem from "../../../../components/CustomerPaginationItem";

const ProductsManagement = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    colors: [],
    sizeIds: [],
    imageIds: [],
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
  const [allImages, setAllImages] = useState([]);

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [restoreProduct] = useRestoreProductMutation();

  const {
    data: userInfo,
    error: userError,
    isLoading: userLoading,
  } = useGetMyInfoQuery();

  const {
    data: productsData,
    isLoading: isFetchingProducts,
    error: fetchProductsError,
    refetch: refetchProducts,
  } = useListProductsForAdminQuery(
    {
      categoryId: selectedCategory || undefined,
      status: selectedStatus || undefined,
      pageNo,
      pageSize,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: categoryData,
    isLoading: isFetchingCategory,
    error: fetchCategoryError,
  } = useListCategoriesForAdminQuery({ pageNo, pageSize });
  console.log("Category data", categoryData);

  const {
    data: colorsData,
    isLoading: isFetchingColors,
    error: fetchColorsError,
  } = useListColorsQuery();

  const {
    data: sizesData,
    isLoading: isFetchingSizes,
    error: fetchSizesError,
  } = useListSizesQuery({ pageNo, pageSize });

  const {
    data: initialAllImagesData,
    isLoading: isFetchingAllImages,
    error: fetchAllImagesError,
  } = useListImagesQuery();

  const [fetchImages] = useLazyListImagesQuery();

  // Lấy toàn bộ hình ảnh từ tất cả các trang
  useEffect(() => {
    const fetchAllImages = async () => {
      if (!initialAllImagesData || !initialAllImagesData.items) {
        setAllImages([]);
        return;
      }

      let allItems = [...initialAllImagesData.items];
      const totalPages = initialAllImagesData.totalPages || 1;

      // Lấy dữ liệu từ các trang còn lại
      for (let page = 1; page <= totalPages; page++) {
        try {
          const { data: nextPageData } = await fetchImages({
            pageNo: page,
            pageSize: 10,
          });
          if (nextPageData?.items) {
            allItems = [...allItems, ...nextPageData.items];
          }
        } catch (error) {
          console.error(`Error fetching images for page ${page}:`, error);
        }
      }

      setAllImages(allItems);
    };

    fetchAllImages();
  }, [initialAllImagesData, fetchImages]);

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
      imageIds: product.images?.map((image) => image.id) || [],
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

  const checkImageUsage = (imageIds, currentProductId = null) => {
    const products = productsData?.items || [];
    const usedImageIds = [];

    products.forEach((product) => {
      if (currentProductId && product.id === currentProductId) return;
      const productImageIds = (product.images || []).map((img) => img.id);
      productImageIds.forEach((id) => {
        if (imageIds.includes(id) && !usedImageIds.includes(id)) {
          usedImageIds.push(id);
        }
      });
    });

    return usedImageIds;
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

    const usedImageIds = checkImageUsage(newProduct.imageIds);
    if (usedImageIds.length > 0) {
      const usedImageNames = usedImageIds
        .map((id) => {
          const image = allImages.find((img) => img.id === id);
          return image?.fileName || `ID: ${id}`;
        })
        .join(", ");
      setSnackbar({
        open: true,
        message: `Hình ảnh "${usedImageNames}" đã được sử dụng bởi sản phẩm khác. Vui lòng tải lên hình ảnh mới hoặc chọn hình ảnh khác.`,
        severity: "warning",
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
        imagesData: allImages || [],
        colorsData,
        sizesData,
        categoryData,
      }).unwrap();
      console.log("add product of categories", categoryData);

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

    const usedImageIds = checkImageUsage(newProduct.imageIds, editProduct?.id);
    if (usedImageIds.length > 0) {
      const usedImageNames = usedImageIds
        .map((id) => {
          const image = allImages.find((img) => img.id === id);
          return image?.fileName || `ID: ${id}`;
        })
        .join(", ");
      setSnackbar({
        open: true,
        message: `Hình ảnh "${usedImageNames}" đã được sử dụng bởi sản phẩm khác. Vui lòng tải lên hình ảnh mới hoặc chọn hình ảnh khác.`,
        severity: "warning",
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

  const handleRestoreProduct = async (id) => {
    try {
      await restoreProduct(id).unwrap();
      setSnackbar({
        open: true,
        message: "Khôi phục sản phẩm thành công!",
        severity: "success",
      });
      refetchProducts();
    } catch (error) {
      const errorMessage = Array.isArray(error.data?.errors)
        ? error.data.errors.join(". ")
        : error.data?.message || "Lỗi khi khôi phục sản phẩm";
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

  const handleRefresh = () => {
    refetchProducts();
    setSnackbar({
      open: true,
      message: "Danh sách sản phẩm đã được làm mới!",
      severity: "info",
    });
  };

  // Check user permissions
  useEffect(() => {
    if (userError) {
      setSnackbar({
        open: true,
        message:
          "Bạn cần đăng nhập để truy cập trang này: " +
          (userError?.data?.message || "Lỗi không xác định"),
        severity: "error",
      });
      setTimeout(() => navigate("/"), 2000);
    } else if (userInfo) {
      const roles = userInfo.result?.roles || [];
      const hasAdminRole = roles.some(
        (role) => role.name?.toUpperCase() === "ADMIN"
      );
      if (!hasAdminRole) {
        setSnackbar({
          open: true,
          message: `Bạn không có quyền truy cập trang này. Vai trò: ${
            roles.map((r) => r.name).join(", ") || "Không xác định"
          }`,
          severity: "error",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    }
  }, [userInfo, userError, userLoading, navigate]);

  // Handle errors for categories, colors, sizes, and images
  useEffect(() => {
    if (fetchCategoryError) {
      setSnackbar({
        open: true,
        message:
          "Lỗi khi tải danh mục: " +
          (fetchCategoryError?.data?.message || "Không xác định"),
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
    if (fetchAllImagesError) {
      setSnackbar({
        open: true,
        message:
          "Lỗi khi tải toàn bộ hình ảnh: " +
          (fetchAllImagesError?.data?.message || "Không xác định"),
        severity: "error",
      });
    }
  }, [
    fetchCategoryError,
    fetchColorsError,
    fetchSizesError,
    fetchAllImagesError,
  ]);

  // Đặt lại pageNo về 1 khi bộ lọc thay đổi
  useEffect(() => {
    setPageNo(1);
  }, [selectedCategory, selectedStatus]);

  // Log dữ liệu API để kiểm tra
  useEffect(() => {
    if (productsData) {
      console.log("Dữ liệu từ API useListProductsForAdminQuery:", productsData);
    }
  }, [productsData]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên", width: 200 },
    { field: "description", headerName: "Mô tả", width: 500 },
    {
      field: "isAvailable",
      headerName: "Có sẵn",
      width: 100,
      type: "number",
    },
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
      field: "images",
      headerName: "Hình ảnh",
      width: 200,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {params.row.images?.map((image) => (
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
        );
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="text"
            color="primary"
            onClick={() => handleEditProduct(params.row)}
          >
            Sửa
          </Button>
          {params.row.status === "ACTIVE" ? (
            <Button
              variant="text"
              color="error"
              onClick={() => handleOpenDeleteDialog(params.row.id)}
            >
              Xóa
            </Button>
          ) : (
            <Button
              variant="text"
              color="success"
              onClick={() => handleRestoreProduct(params.row.id)}
            >
              Khôi phục
            </Button>
          )}
        </>
      ),
    },
  ];

  if (
    userLoading ||
    isFetchingProducts ||
    isFetchingCategory ||
    isFetchingColors ||
    isFetchingSizes ||
    isFetchingAllImages
  ) {
    return <CircularProgress />;
  }

  const rows = productsData?.items || [];
  const totalElements = productsData?.totalElements ?? rows.length;

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Sản phẩm
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ mb: 4 }}
        direction={"row"}
        justifyContent={"flext-start"}
        alignItems={"center"}
      >
        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
              label="Danh mục"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {categoryData?.items?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
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
            onClick={handleRefresh}
            fullWidth
          >
            <RefreshIcon sx={{ mr: 1 }} />
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
      ) : rows.length === 0 ? (
        <Alert severity="info">
          Hiện tại không có sản phẩm nào phù hợp với bộ lọc.
        </Alert>
      ) : (
        <Box height={500} width={"100%"}>
          <DataGrid
            sx={{
              boxShadow: 2,
              border: 2,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            rows={rows}
            columns={columns}
            rowCount={totalElements}
            paginationMode="server"
            pagination
            page={pageNo - 1}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 20, 50, 100]}
            onPageChange={(newPage) => setPageNo(newPage + 1)}
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize);
              setPageNo(1);
            }}
            disableSelectionOnClick
            loading={isFetchingProducts}
            localeText={{
              noRowsLabel: "Hiện tại không có sản phẩm nào",
            }}
            slots={{
              pagination: () => (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={2}
                >
                  <Typography variant="body2">
                    Tổng số sản phẩm: {totalElements}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <CustomPaginationItem
                      type="previous"
                      component={Button}
                      disabled={pageNo === 1}
                      onClick={() => setPageNo(pageNo - 1)}
                    />
                    <Typography variant="body2" mx={2}>
                      Trang {pageNo} / {Math.ceil(totalElements / pageSize)}
                    </Typography>
                    <CustomPaginationItem
                      type="next"
                      component={Button}
                      disabled={pageNo >= Math.ceil(totalElements / pageSize)}
                      onClick={() => setPageNo(pageNo + 1)}
                    />
                  </Box>
                </Box>
              ),
            }}
          />
        </Box>
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
              {categoryData?.items?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
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
              onChange={(e) =>
                setNewProduct({ ...newProduct, colors: e.target.value })
              }
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
              {colorsData?.items?.map((color) => (
                <MenuItem key={color.id} value={color.id}>
                  {color.name}
                </MenuItem>
              ))}
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
              {sizesData?.items?.map((size) => (
                <MenuItem key={size.id} value={size.id}>
                  {size.name}
                </MenuItem>
              ))}
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
                    const image = allImages.find((img) => img.id === value);
                    return (
                      <Chip key={value} label={image?.fileName || value} />
                    );
                  })}
                </Box>
              )}
              disabled={isFetchingAllImages || allImages.length === 0}
              error={!!formErrors.imageIds}
            >
              {allImages.map((image) => (
                <MenuItem key={image.id} value={image.id}>
                  <img
                    src={image.imageUrl}
                    alt={image.fileName}
                    style={{
                      width: 30,
                      height: 30,
                      objectFit: "cover",
                      marginRight: 5,
                    }}
                  />
                  {image.fileName}
                </MenuItem>
              ))}
            </Select>
            {formErrors.imageIds && (
              <FormHelperText error>{formErrors.imageIds}</FormHelperText>
            )}
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
