import { Logout } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectUser } from "@/store/redux/user/reducer";
import { useLogoutMutation } from "@/services/api/auth";
import { clearAuth } from "@/store/redux/auth/reducer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

const UserInfo = ({ isMobile = false, drawerWidth }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myInfo = useSelector(selectUser);
  const [logout] = useLogoutMutation();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          await logout({ accessToken }).unwrap();
        } catch (err) {
          console.log("Logout failed", err);
        }
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(clearAuth());
      dispatch(clearUser());

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Box
      sx={{
        position: isMobile ? "absolute" : "fixed",
        bottom: 0,
        left: 0,
        right: isMobile ? 0 : "auto",
        width: isMobile ? "auto" : drawerWidth,
        backgroundColor: "#f5f5f5",
        p: 2,
        borderTop: "1px solid #e0e0e0",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar
            alt={myInfo?.name}
            src={myInfo?.avatarUrl}
            sx={{ width: 40, height: 40 }}
          />
        </StyledBadge>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {myInfo?.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {myInfo?.email}
          </Typography>
        </Box>

        <IconButton onClick={handleOpenLogoutDialog} size="small">
          <Logout />
        </IconButton>
      </Box>

      <Dialog fullWidth open={openLogoutDialog}>
        <Box sx={{ p: 2 }}>
          <DialogTitle>
            <Typography align="left" sx={{ fontSize: 24, fontWeight: 600 }}>
              Xác nhận đăng xuất
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography>Bạn chắc chắn muốn đăng xuất không ?</Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              sx={{ mr: 1 }}
              color="error"
              variant="outlined"
              onClick={handleCloseLogoutDialog}
            >
              Huỷ
            </Button>
            <Button variant="contained" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default UserInfo;
