import { Fragment, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Stack,
  ListItemAvatar,
  Avatar,
  styled,
  Grid,
  MenuItem,
  Menu,
  Badge,
} from "@mui/material";

import {
  Category,
  Checkroom,
  Dashboard,
  Height,
  Image,
  LocalOffer,
  Logout,
  MoreVert,
  Palette,
  Payment,
  People,
  Place,
  Receipt,
  Store,
  Tune,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectUser } from "../../store/redux/user/reducer";
import { useLogoutMutation } from "../../services/api/auth";
import { clearAuth } from "../../store/redux/auth/reducer";

const drawerWidth = 300;

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

const DashboardLayoutWrapper = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const myInfo = useSelector(selectUser);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const navigationItems = [
    { path: "/admin/dashboard", title: "Tổng quan", icon: <Dashboard /> },
    {
      path: "/admin/productsManagement",
      title: "Sản phẩm",
      icon: <Checkroom />,
    },
    {
      path: "/admin/productVariantsManagement",
      title: "Biến thể sản phẩm",
      icon: <Tune />,
    },
    {
      path: "/admin/productImagesManagement",
      title: "Hình ảnh sản phẩm",
      icon: <Image />,
    },
    {
      path: "/admin/colorsManagement",
      title: "Màu sắc",
      icon: <Palette />,
    },
    {
      path: "/admin/sizesManagement",
      title: "Kích thước",
      icon: <Height />,
    },
    {
      path: "/admin/categoriesManagement",
      title: "Danh mục",
      icon: <Category />,
    },
    {
      path: "/admin/usersManagement",
      title: "Người dùng",
      icon: <People />,
    },
    {
      path: "/admin/wardsManagement",
      title: "Phường / xã",
      icon: <Place />,
    },
    {
      path: "/admin/districtsManagement",
      title: "Quận / huyện",
      icon: <Place />,
    },

    {
      path: "/admin/provincesManagement",
      title: "Tỉnh / thành phố",
      icon: <Place />,
    },
    {
      path: "/admin/addressManagement",
      title: "Địa chỉ",
      icon: <Place />,
    },
    {
      path: "/admin/ordersManagement",
      title: "Đơn hàng",
      icon: <Receipt />,
    },
    {
      path: "/admin/rolesManagement",
      title: "Vai trò",
      icon: <People />,
    },
    {
      path: "/admin/paymentHistoriesManagement",
      title: "Lịch sử Thanh toán",
      icon: <Payment />,
    },
    {
      path: "/admin/branchesManagement",
      title: "Chi nhánh",
      icon: <Store />,
    },
    {
      path: "/admin/promotionsManagement",
      title: "Khuyến mãi",
      icon: <LocalOffer />,
    },
  ];

  const drawer = (
    <Fragment>
      <Toolbar />
      <Grid container>
        <Grid size={12}>
          <List>
            {navigationItems.map((item) => (
              <Link
                to={item.path}
                key={item.path}
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItem
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                    backgroundColor:
                      location.pathname === item.path
                        ? "#f0f0f0"
                        : "transparent",
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Grid>
        <Grid size={12}>
          <List
            sx={{
              backgroundColor: "#f5f5f5",
              width: "100%",
              p: "12px 10px",
              position: "relative",
              bottom: 0,
              left: 0,
            }}
          >
            <ListItem sx={{ p: 0 }}>
              <ListItemAvatar sx={{ m: 0 }}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar alt={myInfo.name} src={myInfo.avatarUrl} />
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText
                primary={myInfo.name}
                secondary={
                  <Typography variant="body2">{myInfo.email}</Typography>
                }
              />

              <IconButton onClick={handleMenuOpen}>
                <MoreVert color="action" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      ml: 5,
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 26,
                        left: -4,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={handleLogout}>
                  <Logout color="action" sx={{ mr: 1 }} />
                  Đăng xuất
                </MenuItem>
              </Menu>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Fragment>
  );

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "var(--color-bg)",
        height: "100vh",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayoutWrapper;
