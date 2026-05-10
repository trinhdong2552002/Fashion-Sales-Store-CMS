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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";

import {
  Category,
  Checkroom,
  Dashboard,
  Height,
  Image,
  LocalOffer,
  Menu,
  Palette,
  Payment,
  People,
  Place,
  Receipt,
  Store,
  Tune,
  ExpandMore,
  LocationOn,
  Inventory,
} from "@mui/icons-material";

import UserInfo from "./shared/user_info";

const drawerWidth = 300;

const DashboardLayoutWrapper = ({ children }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Single navigation items
  const singleNavigationItems = [
    {
      path: "/admin/dashboard-management",
      title: "Tổng quan",
      icon: <Dashboard />,
    },
    {
      path: "/admin/user-management",
      title: "Quản lý người dùng",
      icon: <People />,
    },
    {
      path: "/admin/order-management",
      title: "Quản lý đơn hàng",
      icon: <Receipt />,
    },
    {
      path: "/admin/role-management",
      title: "Quản lý vai trò",
      icon: <People />,
    },
    {
      path: "/admin/payment-history-management",
      title: "Quản lý lịch sử thanh toán",
      icon: <Payment />,
    },
    {
      path: "/admin/branch-management",
      title: "Quản lý chi nhánh",
      icon: <Store />,
    },
    {
      path: "/admin/promotion-management",
      title: "Quản lý khuyến mãi",
      icon: <LocalOffer />,
    },
    {
      path: "/admin/file-management",
      title: "Quản lý file",
      icon: <Image />,
    },
    {
      path: "/admin/address-management",
      title: "Quản lý địa chỉ",
      icon: <Place />,
    },
  ];

  // Grouped navigation items
  const groupedNavigationItems = [
    {
      title: "Mục sản phẩm",
      icon: <Inventory />,
      items: [
        {
          path: "/admin/product-management",
          title: "Quản lý sản phẩm",
          icon: <Checkroom />,
        },
        {
          path: "/admin/product-variant-management",
          title: "Quản lý biến thể sản phẩm",
          icon: <Tune />,
        },

        {
          path: "/admin/category-management",
          title: "Quản lý danh mục",
          icon: <Category />,
        },
        {
          path: "/admin/color-management",
          title: "Quản lý màu sắc",
          icon: <Palette />,
        },
      ],
    },
  ];

  // Check if current path is in a group
  const isPathInGroup = (groupItems) => {
    return groupItems.some((item) => item.path === location.pathname);
  };

  // Navigation content component
  const NavigationContent = ({ isMobile = false }) => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976d2" }}>
          Admin Dashboard
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", pb: "120px" }}>
        <List sx={{ pt: 1 }}>
          {/* Single items */}
          {singleNavigationItems.map((item) => (
            <Link
              to={item.path}
              key={item.path}
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <ListItem
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  backgroundColor:
                    location.pathname === item.path ? "#e3f2fd" : "transparent",
                  border:
                    location.pathname === item.path
                      ? "1px solid #1976d2"
                      : "1px solid transparent",
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.path ? "#1976d2" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color:
                      location.pathname === item.path ? "#1976d2" : "inherit",
                  }}
                />
              </ListItem>
            </Link>
          ))}

          {/* Divider */}
          <Divider sx={{ my: 1 }} />

          {/* Grouped items */}
          {groupedNavigationItems.map((group) => (
            <Accordion
              key={group.title}
              defaultExpanded={isPathInGroup(group.items)}
              sx={{
                boxShadow: "none",
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0 },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      color: isPathInGroup(group.items) ? "#1976d2" : "inherit",
                    }}
                  >
                    {group.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: isPathInGroup(group.items) ? 600 : 400,
                      color: isPathInGroup(group.items) ? "#1976d2" : "inherit",
                    }}
                  >
                    {group.title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List sx={{ pt: 0 }}>
                  {group.items.map((item) => (
                    <Link
                      to={item.path}
                      key={item.path}
                      style={{ textDecoration: "none", color: "inherit" }}
                      onClick={() => isMobile && setMobileOpen(false)}
                    >
                      <ListItem
                        sx={{
                          mx: 1,
                          mb: 0.5,
                          borderRadius: 1,
                          pl: 4,
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                          backgroundColor:
                            location.pathname === item.path
                              ? "#e3f2fd"
                              : "transparent",
                          border:
                            location.pathname === item.path
                              ? "1px solid #1976d2"
                              : "1px solid transparent",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color:
                              location.pathname === item.path
                                ? "#1976d2"
                                : "inherit",
                            minWidth: 32,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          primaryTypographyProps={{
                            fontWeight:
                              location.pathname === item.path ? 600 : 400,
                            color:
                              location.pathname === item.path
                                ? "#1976d2"
                                : "inherit",
                          }}
                        />
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      </Box>

      {/* User info */}
      <UserInfo isMobile={isMobile} drawerWidth={drawerWidth} />
    </Box>
  );

  return (
    <Fragment>
      {/* TODO: Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: "block", sm: "block", md: "none" },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* TODO: Desktop Sidebar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: drawerWidth,
          height: "100vh",
          backgroundColor: "#fff",
          borderRight: "1px solid #e0e0e0",
          // zIndex: 1100,
          display: { xs: "none", md: "block" },
        }}
      >
        <NavigationContent isMobile={false} />
      </Box>

      {/* TODO: Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            position: "relative",
          },
        }}
      >
        <NavigationContent isMobile={true} />
      </Drawer>

      {/* TODO: Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: `${drawerWidth}px` },
          mt: { xs: "64px", md: 0 },
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Box sx={{ p: 4 }}>{children}</Box>
      </Box>
    </Fragment>
  );
};

export default DashboardLayoutWrapper;
