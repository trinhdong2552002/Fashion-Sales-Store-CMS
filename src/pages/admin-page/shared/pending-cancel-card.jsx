import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import { HourglassEmpty } from "@mui/icons-material";

const PendingCancelCard = ({ pending, cancelled }) => {
  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        borderRadius: "12px",
        borderLeft: "6px solid #f59e0b",
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
            CHỜ XỬ LÝ & HỦY
          </Typography>
          <Avatar
            sx={{
              backgroundColor: "#fffbeb",
              color: "#f59e0b",
              width: 44,
              height: 44,
            }}
          >
            <HourglassEmpty />
          </Avatar>
        </Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}
        >
          {pending} / {cancelled}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PendingCancelCard;
