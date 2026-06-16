import React from "react";
import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

const RevenueCard = ({ value, formatCurrency }) => {
  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        borderRadius: "12px",
        borderLeft: "6px solid #10b981",
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
            TỔNG DOANH THU
          </Typography>
          <Avatar
            sx={{
              backgroundColor: "#e6fdf5",
              color: "#10b981",
              width: 44,
              height: 44,
            }}
          >
            <TrendingUp />
          </Avatar>
        </Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}
        >
          {formatCurrency(value)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RevenueCard;
