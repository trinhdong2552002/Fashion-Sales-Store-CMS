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

import styles from "./index.module.css";
import customTheme from "@/components/CustemTheme";
import { Fragment, useEffect, useState } from "react";
import { useForgotPasswordVerifyMutation } from "@/services/api/auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ForgotPasswordVerify = () => {
  const outerTheme = useTheme();
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
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

  const onSubmit = async (data) => {
    setError("");

    try {
      const response = await forgotPasswordVerify({
        email: email,
        verificationCode: data?.verificationCode,
      }).unwrap();

      if (response) {
        navigate("/reset-password", {
          state: {
            message: "Xác thực email thành công !",
            severity: "success",
            forgotPasswordToken: response.result.forgotPasswordToken,
          },
        });
      }
    } catch (error) {
      handleShowSnackbar(false);
      if (error.status === 401) {
        setError("OTP không hợp lệ hoặc người dùng chưa được xác thực !");
      } else {
        setError(
          "Mã OTP không đúng hoặc đã hết hạn. Vui lòng kiểm tra và nhập lại."
        );
      }
      console.log("OTP verification failed:", error);
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
            height: 520,
            borderRadius: 2,
            boxShadow: "0px 4px 30px 5px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              margin: "46px 0 20px 0",
              fontWeight: "inherit",
            }}
          >
            XÁC THỰC TÀI KHOẢN
          </h2>

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
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Email:
                </Typography>
                <Typography variant="body1">{email}</Typography>

                {error && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                  </Typography>
                )}
              </Box>

              <label
                style={{
                  paddingBottom: 4,
                  fontSize: "1.2rem",
                }}
                htmlFor="verificationCode"
              >
                Xác thực mã OTP
              </label>

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
                {errors.verificationCode && (
                  <p className={styles.errorMessage}>
                    {errors.verificationCode.message}
                  </p>
                )}
              </ThemeProvider>
            </Box>

            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  p: "10px 80px",
                  fontSize: "1.2rem",
                  fontWeight: "normal",
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
      </Stack>
    </Fragment>
  );
};

export default ForgotPasswordVerify;
