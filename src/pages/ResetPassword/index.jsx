import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import customTheme from "@/components/CustemTheme";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/services/api/auth";
import styles from "./index.module.css";

const ResetPassword = () => {
  const outerTheme = useTheme();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const forgotPasswordToken = location.state?.forgotPasswordToken || "";

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpNewPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpConfirmPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (location.state?.message) {
      setSnackbar({
        open: true,
        message: location.state.message || "",
        severity: location.state.severity || "success",
      });
    }
    window.history.replaceState({}, document.title);
  }, [location]);

  const handleShowSnackbar = (success) => {
    if (success) {
      setSnackbar({
        open: true,
        message: "Đặt lại mật khẩu thành công !",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Đặt lại mật khẩu thất bại !",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data) => {
    try {
      const response = await resetPassword({
        forgotPasswordToken: forgotPasswordToken,
        newPassword: data?.newPassword,
        confirmPassword: data?.confirmPassword,
      }).unwrap();

      if (response) {
        navigate("/", {
          state: {
            message: "Đặt lại mật khẩu thành công !",
            severity: "success",
          },
        });
      }
    } catch (error) {
      handleShowSnackbar(false);
      console.log("Reset password failed:", error);
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
        sx={{
          backgroundColor: "white",
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
            <h1
              style={{
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              ĐẶT LẠI MẬT KHẨU
            </h1>

            <form
              sx={{ padding: "0px 36px" }}
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
                  htmlFor="newPassword"
                >
                  Mật khẩu mới
                </label>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    id="newPassword"
                    label="Mật khẩu mới"
                    type={showNewPassword ? "text" : "password"}
                    variant="standard"
                    sx={{ mb: 1 }}
                    disabled={isLoading}
                    {...register("newPassword", {
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
                              showNewPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownNewPassword}
                            onMouseUp={handleMouseUpNewPassword}
                            edge="end"
                            disabled={isLoading}
                          >
                            {showNewPassword ? (
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
                {errors.newPassword && (
                  <p className={styles.errorMessage}>
                    {errors.newPassword.message}
                  </p>
                )}

                <label
                  style={{
                    padding: "30px 0 0 0",
                    fontSize: "1.2rem",
                  }}
                  htmlFor="confirmPassword"
                >
                  Xác nhận mật khẩu
                </label>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    id="confirmPassword"
                    label="Xác nhận mật khẩu"
                    type={showConfirmPassword ? "text" : "password"}
                    variant="standard"
                    sx={{ mb: 1 }}
                    disabled={isLoading}
                    {...register("confirmPassword", {
                      required: "Vui lòng xác nhận mật khẩu",
                      validate: (value) =>
                        value === watch("newPassword") ||
                        "Mật khẩu xác nhận không khớp",
                    })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showConfirmPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownConfirmPassword}
                            onMouseUp={handleMouseUpConfirmPassword}
                            edge="end"
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
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
                {errors.confirmPassword && (
                  <p className={styles.errorMessage}>
                    {errors.confirmPassword.message}
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
                  disabled={isLoading}
                >
                  XÁC NHẬN
                </Button>
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
    </Fragment>
  );
};

export default ResetPassword;
