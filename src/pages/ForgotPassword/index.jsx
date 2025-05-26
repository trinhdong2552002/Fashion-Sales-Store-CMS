import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import styles from "./index.module.css";
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

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword({
        email: data?.email,
      }).unwrap();

      if (response) {
        navigate("/forgot-password-verify", {
          state: {
            message: "Đã xác nhận email !",
            severity: "success",
            email: data.email,
          },
        });
      }
    } catch (error) {
      handleShowSnackbar(false);
      console.log("Register failed:", error);
    }
  };

  return (
    <Stack
      alignItems={"center"}
      sx={{
        backgroundColor: "#F8FAFC",
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
          width: 500,
          height: 550,
          borderRadius: 2,
          boxShadow: "0px 4px 30px 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box sx={{ p: "40px 40px 0 40px" }}>
          <h1 style={{ fontWeight: "500", textAlign: "center" }}>
            QUÊN MẬT KHẨU
          </h1>

          <h3
            style={{
              fontWeight: "normal",
              marginTop: 20,
              color: "var(--text-color)",
              textAlign: "center",
            }}
          >
            Vui lòng nhập email để đặt lại mật khẩu.
          </h3>

          <form
            style={{ padding: "0px 36px" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                margin: "30px 0",
              }}
            >
              <label
                style={{
                  fontSize: "1.2rem",
                }}
                htmlFor="email"
              >
                Email
              </label>
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
                />
              </ThemeProvider>
              {errors.email && (
                <p className={styles.errorMessage}>{errors.email.message}</p>
              )}
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
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  p: "10px 80px",
                  mt: 3,
                  fontSize: "1.2rem",
                  fontWeight: "normal",
                }}
                type="submit"
                disabled={isLoading}
              >
                XÁC NHẬN EMAIL
              </Button>

              <Link className={styles.linkFooter} to="/">
                Trở về đăng nhập
              </Link>
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
                variant="filled"
                sx={{ width: "100%", p: "10px 20px" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </form>
        </Box>
      </Box>
    </Stack>
  );
};

export default ForgotPassword;
