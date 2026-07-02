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
} from "@mui/material";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services/api/auth";
import { useLazyGetMyInfoQuery } from "@/services/api/auth";
import { useSnackbar } from "@/components/Snackbar";
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
    formState: { errors },
  } = useForm();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (data) => {
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
            })
          );
          localStorage.setItem("accessToken", response?.result?.accessToken);
          localStorage.setItem("refreshToken", response?.result?.refreshToken);

          await triggerMyInfo();
          showSnackbar("Đăng nhập thành công!", "success");
          navigate("/admin/dashboard-management");
        }
      }
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(`${error.data.message}`, "error");
      }
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
          src={cms}
          alt="CMS"
          width={100}
          height={100}
          draggable="false"
          style={{ margin: "30px 0" }}
        />

        <Box
          sx={{
            backgroundColor: "white",
            width: {
              xs: "90vw",
              sm: 500,
              md: 500,
            },
            height: 600,
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
              Đăng nhập
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
              Chào mừng đến với hệ thống CMS của chúng tôi.
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
