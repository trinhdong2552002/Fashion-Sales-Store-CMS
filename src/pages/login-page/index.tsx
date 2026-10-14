import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Box,
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services/api/auth";
import { useLazyGetMyInfoQuery } from "@/services/api/auth";
import { useSnackbar } from "@/components/snackbar";
import { setAuth } from "@/store/redux/auth/reducer";
import cms from "@/assets/images/cms.png";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [triggerMyInfo] = useLazyGetMyInfoQuery();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: any) => {
    event.preventDefault();
  };

  const handleLogin = async (data: any) => {
    try {
      const response = await login({
        email: data?.email,
        password: data?.password,
      }).unwrap();

      if (response) {
        const role = response?.result?.roles?.[0]?.name;

        if (role === "USER") {
          showSnackbar(
            "Đăng nhập với tư cách User không được phép trên Admin.",
            "error",
          );
          return;
        }

        if (role === "ADMIN") {
          dispatch(
            setAuth({
              accessToken: response?.result?.accessToken,
              email: response?.result?.email,
              roles: response?.result?.roles,
            }),
          );
          localStorage.setItem("accessToken", response?.result?.accessToken);
          localStorage.setItem("refreshToken", response?.result?.refreshToken);

          await triggerMyInfo(undefined);
          showSnackbar("Đăng nhập thành công!", "success");
          navigate("/admin/dashboard");
        }
      }
    } catch (error: any) {
      if (error && error.data && error.data.message) {
        showSnackbar(`${error.data.message}`, "error");
      } else {
        showSnackbar("Đăng nhập thất bại! Vui lòng thử lại sau.", "error");
      }
    }
  };

  return (
    <Fragment>
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f3f6fa 0%, #e6eef8 100%)",
          position: "relative",
          overflow: "hidden",
          py: 4,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(25, 118, 210, 0.12) 0%, rgba(25, 118, 210, 0) 70%)",
            top: "10%",
            left: "15%",
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(118, 75, 162, 0.08) 0%, rgba(118, 75, 162, 0) 70%)",
            bottom: "10%",
            right: "15%",
            zIndex: 0,
          },
        }}
      >
        <img
          src={cms}
          alt="CMS"
          width={100}
          height={100}
          draggable="false"
          style={{ margin: "20px 0", zIndex: 1, position: "relative" }}
        />

        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(16px)",
            width: {
              xs: "90vw",
              sm: 500,
              md: 500,
            },
            height: 600,
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0px 8px 32px rgba(31, 38, 135, 0.06)",
            zIndex: 1,
            position: "relative",
            mb: {
              md: 0,
              sm: 0,
              xs: 4,
            },
          }}
        >
          <Box px={4} py={4}>
            <Typography variant="h4" align="center" fontWeight={"bold"} my={2}>
              Đăng nhập
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="#666"
              fontWeight={400}
            >
              Chào mừng đến với hệ thống quản lý cửa hàng của chúng tôi.
            </Typography>

            <form onSubmit={handleSubmit(handleLogin)}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "30px 0",
                }}
              >
                <TextField
                  id="email"
                  label="Email"
                  type=""
                  variant="standard"
                  disabled={isLoginLoading}
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
                  sx={{ mb: 4 }}
                />

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
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  FormHelperTextProps={{
                    sx: { fontSize: "0.9rem", color: "red" },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="primary"
                          sx={{ mr: 1 }}
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
                    mt: 3,
                    fontSize: "1.2rem",
                  }}
                  type="submit"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress
                        size={34}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />
                    </Box>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Stack>
    </Fragment>
  );
};

export default LoginPage;
