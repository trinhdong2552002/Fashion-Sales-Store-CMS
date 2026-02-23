import { ArrowBack, Warning } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      height={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Warning color="primary" sx={{ width: "10%", height: "10%", mb: 4 }} />
      <Typography variant="h3" mb={2}>
        404
      </Typography>
      <Typography variant="h4">Trang không tìm thấy</Typography>
      <Typography
        variant="subtitle1"
        textAlign={"center"}
        my={2}
        color={"#666"}
        width={500}
      >
        Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Hãy quay
        lại trang tổng quan và thử lại.
      </Typography>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="outlined" color="primary" sx={{ mt: 3 }}>
          <ArrowBack sx={{ mr: 1 }} />
          Quay lại trang tổng quan
        </Button>
      </Link>
    </Box>
  );
};

export default NotFound;
