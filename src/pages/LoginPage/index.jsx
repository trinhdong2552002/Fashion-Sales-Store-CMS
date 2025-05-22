import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ThemeProvider,
  useTheme,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useLoginMutation, useGetMyInfoQuery } from "@/services/api/auth";
import customTheme from "@/components/CustemTheme";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../store/redux/auth/reducer";

const Login = () => {
  const outerTheme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [login, { isLoading: isLoginLoading, error: loginError }] =
    useLoginMutation();
  const { data: myInfo, isLoading: isMyInfoLoading } = useGetMyInfoQuery();

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
        localStorage.setItem("accessToken", response.result.accessToken);
        localStorage.setItem("refreshToken", response.result.refreshToken);

        console.log("Login response:", response);

        const newUserData = {
          code: response.code,
          message: response.message,
          result: {
            accessToken: response.result.accessToken,
            refreshToken: response.result.refreshToken,
            authenticated: response.result.authenticated,
            email: response.result.email,
            roles: response.result.roles,
          },
        };

        dispatch(setAuth(newUserData));

        handleShowSnackbar(true);

        if (myInfo) {
          const role = myInfo?.result?.roles?.[0]?.name || "USER";
          if (role === "ADMIN") {
            handleShowSnackbar(true, "Đăng nhập với quyền ADMIN");
            setTimeout(() => {
              navigate("/admin/dashboard");
            }, 1000);
          } else {
            handleShowSnackbar(false, "Tài khoản không có quyền ADMIN!");
          }
        }
      }
    } catch (error) {
      handleShowSnackbar(false);
      console.log("Login failed:", error);
    }
  };

  return (
    <Fragment>
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

      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          backgroundImage: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
          height: "100vh",
        }}
      >
        <Stack
          sx={{
            backgroundColor: "white",
            width: 800,
            height: 500,
            borderRadius: 4,
            boxShadow: "0px 4px 30px 5px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Grid container>
            <Grid item lg={6} md={6}>
              <h2
                style={{
                  textAlign: "center",
                  margin: "46px 0 20px 0",
                  fontWeight: "inherit",
                }}
              >
                THÔNG TIN ĐĂNG NHẬP
              </h2>

              <Stack
                sx={{ padding: "0px 36px" }}
                component={"form"}
                onSubmit={handleSubmit(handleLogin)}
              >
                {loginError && <p style={{ color: "red" }}>{loginError}</p>}
                <Stack className={styles.formLabelInput}>
                  <label className={styles.labelInput} htmlFor="email">
                    Email
                  </label>
                  <ThemeProvider theme={customTheme(outerTheme)}>
                    <TextField
                      id="email"
                      label="Email"
                      variant="outlined"
                      disabled={isLoginLoading || isMyInfoLoading}
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
                    <p className={styles.errorMessage}>
                      {errors.email.message}
                    </p>
                  )}
                </Stack>

                <Stack className={styles.formLabelInput}>
                  <label className={styles.labelInput} htmlFor="password">
                    Mật khẩu
                  </label>
                  <ThemeProvider theme={customTheme(outerTheme)}>
                    <TextField
                      id="password"
                      label="Mật khẩu"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      disabled={isLoginLoading || isMyInfoLoading}
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
                              disabled={isLoginLoading || isMyInfoLoading}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
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
                </Stack>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "10px 24px",
                    marginTop: "14px",
                    fontSize: "1.2rem",
                    fontWeight: "regular",
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                  }}
                  type="submit"
                  disabled={isLoginLoading || isMyInfoLoading}
                >
                  {isLoginLoading || isMyInfoLoading ? (
                    <CircularProgress size={34} color="inherit" />
                  ) : (
                    "ĐĂNG NHẬP"
                  )}
                </Button>
              </Stack>
            </Grid>

            <Grid item lg={6} md={6}>
              <img
                style={{
                  width: "100%",
                  height: 500,
                  borderTopRightRadius: 16,
                  borderBottomRightRadius: 16,
                  objectFit: "cover",
                }}
                src="/src/assets/images/backgroundFashions/background-login.jpg"
              />
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Fragment>
  );
};

export default Login;
