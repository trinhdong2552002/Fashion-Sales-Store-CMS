// layouts/DashboardLayout/index.jsx
import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Switch,
  Stack,
  ListItemAvatar,
  Avatar,
  styled,
  Grid,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTheme } from "/src/context/ThemeProvider";
import {
  Height,
  Image,
  Inventory,
  LocalOffer,
  Palette,
  Payment,
  People,
  Place,
  Store,
} from "@mui/icons-material";
import AuthButton from "../../components/AuthButton";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/redux/user/reducer";

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
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleTheme, mode } = useTheme();
  const myInfo = useSelector(selectUser);
  console.log("myInfo", myInfo);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { path: "/admin/dashboard", title: "Tổng quan", icon: <DashboardIcon /> },
    {
      path: "/admin/productsManagement",
      title: "Sản phẩm",
      icon: <Inventory />,
    },
    {
      path: "/admin/productImagesManagement",
      title: "Hình ảnh sản phẩm",
      icon: <Image />,
    },
    {
      path: "/admin/productVariantsManagement",
      title: "Biến thể sản phẩm",
      icon: <Inventory />,
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
      icon: <CategoryIcon />,
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
      path: "/admin/ordersManagement",
      title: "Đơn hàng",
      icon: <ShoppingCartIcon />,
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

      <Grid container spacing={5}>
        <Grid size={12}>
          <List>
            {navigationItems.map((item) => (
              <Link
                to={item.path}
                key={item.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem
                  sx={{
                    "&:hover": {
                      backgroundColor: mode === "dark" ? "#424242" : "#f5f5f5",
                    },
                    backgroundColor:
                      location.pathname === item.path
                        ? mode === "dark"
                          ? "#616161"
                          : "#f0f0f0"
                        : "transparent",
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      color: mode === "dark" ? "#ffffff" : "black",
                    }}
                  />
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
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Fragment>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: mode === "dark" ? "#333333" : undefined,
          color: mode === "dark" ? "#ffffff" : undefined,
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
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: mode === "dark" ? "#ffffff" : undefined }}
          >
            Admin Dashboard
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AuthButton />
            <Switch
              checked={mode === "dark"}
              onChange={toggleTheme}
              sx={{
                "& .MuiSwitch-switchBase": {
                  color: mode === "dark" ? "#" : undefined,
                },
                "& .MuiSwitch-track": {
                  backgroundColor: mode === "dark" ? "#bbbbbb" : undefined,
                },
                "& .MuiSwitch-thumb": {
                  color: mode === "dark" ? "#ffffff" : undefined,
                },
              }}
            />
          </Stack>
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
              backgroundColor: mode === "dark" ? "#212121" : undefined,
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
              backgroundColor: mode === "dark" ? "#212121" : undefined,
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
          backgroundColor: mode === "dark" ? "#000000" : undefined,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayoutWrapper;
