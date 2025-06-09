import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <Box sx={{ bgcolor: "#ffebee", height: "100vh" }}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{ height: "100%" }}
      >
        <Card
          variant="outlined"
          sx={{
            maxWidth: 500,
            height: 520,
            borderRadius: 4,
          }}
        >
          <Box display={"flex"} justifyContent={"center"}>
            <CardMedia
              sx={{
                height: 130,
                width: 130,
                m: 6,
              }}
              image="/src/assets/images/error.png"
              title="green iguana"
            />
          </Box>
          <CardContent>
            <Typography variant="h4" color="error" align="center">
              ❗Có lỗi xảy ra.
            </Typography>
            <Typography
              variant="h6"
              color="error"
              align="center"
              sx={{ mt: 4 }}
            >
              {error.message ||
                "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau !"}
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              pb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2, p: "10px 50px", fontSize: 16 }}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};

export default ErrorDisplay;
