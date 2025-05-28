import {
  Stack,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Divider,
  styled,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/services/api/auth";
import { clearAuth } from "../../store/redux/auth/reducer";
import { clearUser, selectUser } from "../../store/redux/user/reducer";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const AuthButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const user = useSelector(selectUser);
  console.log("user", user);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      if (!localStorage.getItem("accessToken")) {
        throw new Error("accessToken is required for logout");
      }
      const response = await logout({
        accessToken: localStorage.getItem("accessToken"),
      }).unwrap();
      console.log("Logout response:", response);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(clearAuth());
      dispatch(clearUser());
      handleMenuClose();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Fragment>
      {user && (
        <Fragment>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              sx={{ cursor: "pointer" }}
              onClick={handleMenuOpen}
              src={user.avatarUrl}
              alt={user.name || user.email}
            />
          </StyledBadge>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate("/accountInform/profile")}>
              Thông tin tài khoản
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </Fragment>
      )}
    </Fragment>
  );
};

export default AuthButton;
