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
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import customTheme from "@/components/CustemTheme";
import { Fragment, useState } from "react";
import { useForgotPasswordVerifyMutation } from "@/services/api/auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ForgotPasswordVerify = () => {
  const outerTheme = useTheme();
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [forgotPasswordVerify, { isLoading }] =
    useForgotPasswordVerifyMutation();
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

  const email = location.state?.email || "Không có email";
  console.log("Email received in VerifyAccount:", email);

  const handleClickShowOtp = () => setShowOtp((show) => !show);

  const handleMouseDownOtp = (event) => {
    event.preventDefault();
  };

  const handleMouseUpOtp = (event) => {
    event.preventDefault();
  };

  const handleShowSnackbar = (success) => {
    if (success) {
      setSnackbar({
        open: true,
        message: "Xác thực OTP thành công !",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Xác thực OTP thất bại !",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleForgotPasswordVerify = async (data) => {
    try {
      const response = await forgotPasswordVerify({
        email: email,
        verificationCode: data?.verificationCode,
      }).unwrap();
      const token = response?.result?.forgotPasswordToken;
      localStorage.setItem("forgotPasswordToken", token);

      if (response) {
        handleShowSnackbar(true);
        setTimeout(() => {
          navigate("/forgot-password/reset-password", {
            state: { email, forgotPasswordToken: token },
          });
        }, 1000);
      }
    } catch (error) {
      handleShowSnackbar(false);
      console.log("OTP verification failed:", error);
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
            height: 500,
            borderRadius: 2,
            boxShadow: "0px 4px 30px 5px rgba(0, 0, 0, 0.3)",
            mb: {
              md: 0,
              sm: 0,
              xs: 4,
            },
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
                mt: 4,
                mb: 4,
              }}
            >
              Xác thực tài khoản
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
              Vui lòng nhập OTP chúng tôi đã gửi đến email của bạn.
            </Typography>

            <form onSubmit={handleSubmit(handleForgotPasswordVerify)}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "30px 0",
                }}
              >
                <Typography
                  sx={{
                    mt: 2,
                    mb: 2,
                    fontSize: "1.1rem",
                    fontWeight: 500,
                  }}
                >
                  {email}
                </Typography>

                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    id="verificationCode"
                    label="Nhập mã OTP"
                    type={showOtp ? "text" : "password"}
                    variant="standard"
                    sx={{ mb: 1 }}
                    disabled={isLoading}
                    {...register("verificationCode", {
                      required: "OTP không được để trống",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "OTP phải là 6 chữ số",
                      },
                    })}
                    error={!!errors.verificationCode}
                    helperText={errors.verificationCode?.message}
                    FormHelperTextProps={{
                      sx: { fontSize: "0.9rem", color: "red" },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showOtp ? "hide the OTP" : "display the OTP"
                            }
                            onClick={handleClickShowOtp}
                            onMouseDown={handleMouseDownOtp}
                            onMouseUp={handleMouseUpOtp}
                            edge="end"
                            disabled={isLoading}
                          >
                            {showOtp ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </ThemeProvider>
              </Box>

              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
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
                    fontSize: "1.2rem",
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

export default ForgotPasswordVerify;
