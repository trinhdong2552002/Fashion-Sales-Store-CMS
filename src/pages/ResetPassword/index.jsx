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
  Typography,
  useTheme,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import customTheme from "@/components/CustemTheme";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/services/api/auth";

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

  const handleResetPassword = async (data) => {
    try {
      const response = await resetPassword({
        forgotPasswordToken: forgotPasswordToken,
        newPassword: data?.newPassword,
        confirmPassword: data?.confirmPassword,
      }).unwrap();

      if (response) {
        handleShowSnackbar(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      handleShowSnackbar(false);
      console.log("Reset password failed:", error);
    }
  };

  return (
    <Fragment>
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
            height: 540,
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
              Đặt lại mật khẩu
            </Typography>

            <Typography
              variant="h2"
              align="center"
              sx={{
                fontWeight: "400",
                fontSize: {
                  md: "1.1rem",
                  sm: "1.1rem",
                  xs: "1rem",
                },
                lineHeight: "1.2rem",
                color: "var(--color-text-muted)",
              }}
            >
              Vui lòng nhập mật khẩu mới.
            </Typography>

            <form onSubmit={handleSubmit(handleResetPassword)}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "30px 0",
                }}
              >
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    id="newPassword"
                    label="Mật khẩu mới"
                    type={showNewPassword ? "text" : "password"}
                    variant="standard"
                    sx={{ mb: 4 }}
                    disabled={isLoading}
                    {...register("newPassword", {
                      required: "Mật khẩu không được để trống",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    FormHelperTextProps={{
                      sx: { fontSize: "0.9rem", color: "red" },
                    }}
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
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    FormHelperTextProps={{
                      sx: { fontSize: "0.9rem", color: "red" },
                    }}
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
                      md: "1.2rem",
                      sm: "1.2rem",
                      xs: "1rem",
                    },
                  }}
                  type="submit"
                  disabled={isLoading}
                >
                  Xác nhận
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Stack>

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
    </Fragment>
  );
};

export default ResetPassword;
