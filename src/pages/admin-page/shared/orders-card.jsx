import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";

const OrdersCard = ({ value }) => {
  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        borderRadius: "12px",
        borderLeft: "6px solid #3b82f6",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: "#64748b", fontWeight: 600 }}
          >
            TỔNG ĐƠN HÀNG
          </Typography>
          <Avatar
            sx={{
              backgroundColor: "#eff6ff",
              color: "#3b82f6",
              width: 44,
              height: 44,
            }}
          >
            <ShoppingBag />
          </Avatar>
        </Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OrdersCard;
