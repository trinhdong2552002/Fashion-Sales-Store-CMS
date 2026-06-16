import React from "react";
import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const CompletedCard = ({ value }) => {
  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        borderRadius: "12px",
        borderLeft: "6px solid #059669",
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
            ĐƠN THÀNH CÔNG
          </Typography>
          <Avatar
            sx={{
              backgroundColor: "#ecfdf5",
              color: "#059669",
              width: 44,
              height: 44,
            }}
          >
            <CheckCircle />
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

export default CompletedCard;
