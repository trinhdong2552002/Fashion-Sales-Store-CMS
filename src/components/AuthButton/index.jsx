import {
  Stack,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUser, selectUser } from "@/store/redux/user/reducer";
import { useLogoutMutation } from "@/services/api/auth";
import storage from "redux-persist/lib/storage";

const AuthButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const storedUser = useSelector(selectUser);
  // console.log("storedUser:", storedUser);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No accessToken found in localStorage");
      }

      await logout({
        accessToken,
      }).unwrap();

      localStorage.removeItem("accessToken");
      storage.removeItem("persist:root");
      dispatch(clearUser());

      handleMenuClose();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Fragment>
      {storedUser && (
        <>
          <Stack
            direction="row"
            alignItems="center"
            onClick={handleMenuOpen}
            sx={{ cursor: "pointer" }}
          >
            <Avatar
              src={storedUser.avatarUrl}
              alt={storedUser.email || "User"}
            />
            <Typography sx={{ marginLeft: "5px" }}>
              {storedUser.email || "Tài khoản"}
            </Typography>
          </Stack>

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
        </>
      )}
    </Fragment>
  );
};

export default AuthButton;
