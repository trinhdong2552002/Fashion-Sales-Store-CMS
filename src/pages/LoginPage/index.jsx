import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ThemeProvider,
  useTheme,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useLoginMutation } from "@/services/api/auth";
import customTheme from "@/components/CustemTheme";
import { useLazyGetMyInfoQuery } from "../../services/api/auth";

const Login = () => {
  const outerTheme = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [triggerMyInfo] = useLazyGetMyInfoQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleShowSnackbar = (success, message = "") => {
    setSnackbar({
      open: true,
      message:
        message || (success ? "Đăng nhập thành công" : "Đăng nhập thất bại !"),
      severity: success ? "success" : "error",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogin = async (data) => {
    try {
      const response = await login({
        email: data?.email,
        password: data?.password,
      }).unwrap();

      if (response) {
        const role = response?.result?.roles?.[0]?.name;
        if (!role) {
          throw new Error(
            "Không thể xác định vai trò người dùng. Vui lòng thử lại."
          );
        }

        if (role !== "ADMIN") {
          throw new Error("Bạn không có quyền truy cập vào trang quản trị !");
        }

        if (role === "ADMIN" && "USER") {
          handleShowSnackbar(true, "Đăng nhập với quyền ADMIN");
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1000);
        }

        localStorage.setItem("accessToken", response.result.accessToken);
        localStorage.setItem("refreshToken", response.result.refreshToken);

        await triggerMyInfo();
      }
    } catch (error) {
      const messageError =
        error?.message || error?.data?.message || "Đăng nhập thất bại !";
      handleShowSnackbar(false, messageError);
      console.log("Login failed:", error);
    }
  };

  return (
    <Fragment>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
          style={{ margin: "30px 0" }}
        />

        <Box
          sx={{
            backgroundColor: "white",
            width: 500,
            height: 600,
            borderRadius: 2,
            boxShadow: "0px 4px 30px 5px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box sx={{ p: "40px 40px 0 40px" }}>
            <h1 style={{ fontWeight: "500", textAlign: "center" }}>
              ĐĂNG NHẬP
            </h1>
            <h3
              style={{
                fontWeight: "normal",
                marginTop: 20,
                color: "var(--color-text-muted)",
              }}
            >
              Chào mừng đến với hệ thống CMS của chúng tôi.
            </h3>

            <form onSubmit={handleSubmit(handleLogin)}>
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
                    disabled={isLoginLoading}
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

                <label
                  style={{ padding: "30px 0 0 0", fontSize: "1.2rem" }}
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    id="password"
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    variant="standard"
                    disabled={isLoginLoading}
                    {...register("password", {
                      required: "Mật khẩu không được để trống",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                            disabled={isLoginLoading}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </ThemeProvider>
                {errors.password && (
                  <p className={styles.errorMessage}>
                    {errors.password.message}
                  </p>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Link className={styles.forgotPassword} to="/forgot-password">
                  Quên mật khẩu ?
                </Link>

                <Button
                  variant="contained"
                  sx={{
                    p: "10px 80px",
                    mt: 3,
                    fontSize: "1.2rem",
                    fontWeight: "normal",
                    
                  }}
                  type="submit"
                  disabled={isLoginLoading}
                >
                  ĐĂNG NHẬP
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Stack>
    </Fragment>
  );
};

export default Login;
