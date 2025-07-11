import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";
import styles from "./index.module.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import customTheme from "@/components/CustemTheme";
import { useState } from "react";
import { useForgotPasswordMutation } from "@/services/api/auth";

const ForgotPassword = () => {
  const outerTheme = useTheme();
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleShowSnackbar = (success) => {
    if (success) {
      setSnackbar({
        open: true,
        message: "Đã xác nhận email !",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Xác nhận email thất bại !",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleForgotPassword = async (data) => {
    try {
      const response = await forgotPassword({
        email: data?.email,
      }).unwrap();

      if (response) {
        handleShowSnackbar(true);
        setTimeout(() => {
          navigate("/forgot-password/forgot-password-verify", {
            state: { email: data.email },
          });
        }, 1000);
      }
    } catch (error) {
      handleShowSnackbar(false);
      console.log("Verify account failed:", error);
    }
  };

  return (
    <Stack
      alignItems={"center"}
      sx={{
        backgroundColor: "var(--color-bg)",
        height: "100vh",
      }}
    >
      <img
        src="/src/assets/images/cms.png"
        alt="CMS"
        width={100}
        height={100}
        draggable="false"
        style={{ margin: "40px 0" }}
      />

      <Box
        sx={{
          backgroundColor: "white",
          width: {
            xs: "90vw",
            sm: 500,
            md: 500,
          },
          height: 500,
          borderRadius: 2,
          boxShadow: "0px 4px 30px 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box sx={{ p: "40px 40px 0 40px" }}>
          <Typography
            variant="h1"
            align="center"
            sx={{
              fontWeight: "500",
              fontSize: {
                md: "2.2rem",
                sm: "2.2rem",
                xs: "1.8rem",
              },
              m: 4,
            }}
          >
            Quên mật khẩu
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontWeight: "400",
              fontSize: {
                md: "1.2rem",
                sm: "1.2rem",
                xs: "1rem",
              },
              lineHeight: "1.2rem",
              color: "var(--color-text-muted)",
              textAlign: "center",
            }}
          >
            Vui lòng nhập email để đặt lại mật khẩu.
          </Typography>

          <form onSubmit={handleSubmit(handleForgotPassword)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                margin: "30px 0",
              }}
            >
              <ThemeProvider theme={customTheme(outerTheme)}>
                <TextField
                  id="email"
                  label="Email"
                  variant="standard"
                  sx={{ mb: 1 }}
                  disabled={isLoading}
                  {...register("email", {
                    required: "Email không được để trống",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email không hợp lệ",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  FormHelperTextProps={{
                    sx: { fontSize: "0.9rem", color: "red" },
                  }}
                />
              </ThemeProvider>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                fullWidth
                sx={{
                  p: {
                    md: "10px 80px",
                    sm: "10px 80px",
                    xs: "10px 60px",
                  },
                  mt: 3,
                  fontSize: {
                    md: "1.1rem",
                    sm: "1.1rem",
                    xs: "1rem",
                  },
                }}
                type="submit"
                disabled={isLoading}
              >
                Xác nhận email
              </Button>

              <Link className={styles.backToLogin} to="/">
                Trở về đăng nhập
              </Link>
            </Box>
          </form>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "right", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="standard"
          sx={{ width: "100%", p: "10px 20px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default ForgotPassword;
