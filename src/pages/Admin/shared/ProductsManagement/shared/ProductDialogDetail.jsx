import { Fragment } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
} from "@mui/material";

const ProductDialogDetail = ({ open, onClose, product }) => {
  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết sản phẩm</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          {/* Product Name */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Tên sản phẩm:</strong> {product?.name || "N/A"}
          </Typography>

          {/* Description */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Mô tả:</strong> {product?.description || "Không có mô tả"}
          </Typography>

          {/* Category */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Danh mục:</strong>{" "}
            {product?.category?.name || "Không có danh mục"}
          </Typography>

          {/* Price */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Giá:</strong>{" "}
            {product?.price
              ? `${product.price.toLocaleString("vi-VN")} VND`
              : "N/A"}
          </Typography>

          {/* Quantity */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Số lượng:</strong> {product?.quantity || 0}
          </Typography>

          {/* Availability */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Trạng thái:</strong>{" "}
            {product?.isAvailable ? "Có sẵn" : "Không có sẵn"}
          </Typography>

          {/* Average Rating */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Đánh giá trung bình:</strong>{" "}
            {product?.averageRating || "N/A"}
          </Typography>

          {/* Sold Quantity */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Số lượng đã bán:</strong> {product?.soldQuantity || 0}
          </Typography>

          {/* Total Reviews */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Tổng đánh giá:</strong> {product?.totalReviews || 0}
          </Typography>

          {/* Colors */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Màu sắc:</strong>
            {product?.colors?.length > 0 ? (
              <Box sx={{ mt: 1 }}>
                {product.colors.map((color) => (
                  <Chip
                    key={color.id}
                    label={color.name}
                    sx={{ mr: 1, mb: 1 }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              " Không có màu sắc"
            )}
          </Typography>

          {/* Sizes */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Kích thước:</strong>
            {product?.sizes?.length > 0 ? (
              <Box sx={{ mt: 1 }}>
                {product.sizes.map((size) => (
                  <Chip
                    key={size.id}
                    label={size.name}
                    sx={{ mr: 1, mb: 1 }}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              " Không có kích thước"
            )}
          </Typography>

          {/* Images */}
          <Typography component={"div"} variant="body1" gutterBottom>
            <strong>Hình ảnh:</strong>
            {product?.images?.length > 0 ? (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {product.images.map((image) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image.id}>
                    <img
                      src={image.imageUrl}
                      alt={image.fileName}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <Typography
                      variant="caption"
                      display="block"
                      align="center"
                    >
                      {image.fileName}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            ) : (
              " Không có hình ảnh"
            )}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ m: 2 }}>
        <Button onClick={onClose} color="success" variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialogDetail;
