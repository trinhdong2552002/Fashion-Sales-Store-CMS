import {
  Stack,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUser, selectUser } from "@/store/redux/user/reducer";
import { baseApi } from "@/services/api";
import storage from "redux-persist/lib/storage";

const AuthButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const storedUser = useSelector(selectUser);
  console.log("storedUser:", storedUser);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Xóa accessToken và user khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    // Xóa dữ liệu persist:root để redux-persist không khôi phục trạng thái cũ
    storage.removeItem("persist:root");

    // Xóa user khỏi Redux store
    dispatch(clearUser());

    // Xóa toàn bộ cache của RTK Query
    dispatch(baseApi.util.resetApiState());

    handleMenuClose();
    navigate("/");
  };

  return (
    <Stack direction="row" alignItems="center">
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
              {storedUser.email || "Người dùng"}
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
    </Stack>
  );
};

export default AuthButton;
