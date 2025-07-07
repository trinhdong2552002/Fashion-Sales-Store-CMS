import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  Box,
  IconButton,
} from "@mui/material";
import {
  useFetchAllUsersForAdminQuery,
  useCreateUserWithRoleMutation,
  useSoftDeleteUserMutation,
  useRestoreUserMutation,
} from "@/services/api/user";
import { useGetMyInfoQuery } from "@/services/api/auth";
import { useListRolesQuery } from "@/services/api/role";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Add, Delete, Refresh, Restore } from "@mui/icons-material";

const UsersManagement = () => {
  const navigate = useNavigate();
  const [searchUser, setSearchUser] = useState("");
  const [filterRoles, setFilterRoles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToRestore, setUserToRestore] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleIds: [],
  });

  const {
    data: userInfo,
    error: userError,
    isLoading: userLoading,
  } = useGetMyInfoQuery();

  const {
    data: usersData,
    refetch: refetchUsers,
    isLoading: isFetchingUsers,
  } = useFetchAllUsersForAdminQuery({
    pageNo: page + 1,
    pageSize,
    search: searchUser,
    sortBy: "name-asc",
    roles: filterRoles.length ? filterRoles.join(",") : undefined,
  });
  const { data: rolesData } = useListRolesQuery({ pageNo: 1, pageSize: 100 });

  const [createUserWithRole] = useCreateUserWithRoleMutation();
  const [softDeleteUser] = useSoftDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();

  useEffect(() => {
    if (userError) {
      setSnackbar({
        open: true,
        message:
          "Bạn cần đăng nhập để truy cập trang này: " +
          (userError?.data?.message || "Lỗi không xác định"),
        severity: "error",
      });
      setTimeout(() => navigate("/"), 2000);
    } else if (userInfo) {
      const roles = userInfo.result?.roles || [];
      const hasAdminRole = roles.some(
        (role) => role.name?.toUpperCase() === "ADMIN"
      );
      if (!hasAdminRole) {
        setSnackbar({
          open: true,
          message: `Bạn không có quyền truy cập trang này. Vai trò: ${
            roles.map((r) => r.name).join(", ") || "Không xác định"
          }`,
          severity: "error",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    }
  }, [userInfo, userError, userLoading, navigate]);

  useEffect(() => {
    refetchUsers();
  }, [searchUser, filterRoles, page, pageSize, refetchUsers]);

  useEffect(() => {
    if (usersData) {
      setTotalRows(usersData.totalItems || 0);
    }
  }, [usersData]);

  const handleAddUser = async () => {
    try {
      await createUserWithRole({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        roleIds: newUser.roleIds,
      }).unwrap();
      setNewUser({
        name: "",
        email: "",
        phone: "",
        password: "",
        roleIds: [],
      });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Thêm người dùng thành công!",
        severity: "success",
      });
      refetchUsers();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi thêm người dùng";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await softDeleteUser(userToDelete).unwrap();
      setOpenDeleteDialog(false);
      setUserToDelete(null);
      setSnackbar({
        open: true,
        message: "Xóa người dùng thành công!",
        severity: "success",
      });
      refetchUsers();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi xóa người dùng";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleRestoreUser = async () => {
    try {
      await restoreUser(userToRestore).unwrap();
      setSnackbar({
        open: true,
        message: "Khôi phục người dùng thành công!",
        severity: "success",
      });
      setOpenRestoreDialog(false);
      setUserToRestore(null);
      refetchUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.data?.message || "Lỗi khi khôi phục người dùng",
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setUserToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleOpenRestoreDialog = (id) => {
    setUserToRestore(id);
    setOpenRestoreDialog(true);
  };

  const handleCloseRestoreDialog = () => {
    setUserToRestore(null);
    setOpenRestoreDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    setPage(0);
    refetchUsers();
    setSnackbar({
      open: true,
      message: "Danh sách người dùng đã được làm mới!",
      severity: "info",
    });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "status", headerName: "Trạng thái", width: 150 },

    {
      field: "createdBy",
      headerName: "Người tạo",
      width: 200,
      renderCell: (params) => params.row.createdBy || "N/A",
    },
    {
      field: "updatedBy",
      headerName: "Người cập nhật",
      width: 200,
      renderCell: (params) => params.row.updatedBy || "N/A",
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 150,
      renderCell: (params) =>
        params.row.createdAt
          ? new Date(params.row.createdAt).toLocaleDateString("vi-VN")
          : "N/A",
    },
    {
      field: "updatedAt",
      headerName: "Ngày cập nhật",
      width: 150,
      renderCell: (params) =>
        params.row.updatedAt
          ? new Date(params.row.updatedAt).toLocaleDateString("vi-VN")
          : "N/A",
    },
    {
      field: "roles",
      headerName: "Vai trò",
      width: 150,
      renderCell: (params) =>
        params.row?.roles?.map((role) => role.name).join(", ") || "N/A",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <>
          {params.row?.status === "INACTIVE" ? (
            <IconButton
              onClick={() => handleOpenRestoreDialog(params.row.id)}
              color="success"
            >
              <Restore />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleOpenDeleteDialog(params.row.id)}
              color="error"
            >
              <Delete />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const filteredRows = (usersData?.items || []).filter((user) => {
    const matchesRoles = filterRoles.length
      ? user.roles?.some((role) => filterRoles.includes(role.name))
      : true;

    const matchesSearch = searchUser
      ? user.name?.toLowerCase().includes(searchUser.toLowerCase())
      : true;

    return matchesRoles && matchesSearch;
  });

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Người dùng
      </Typography>

      <Box
        sx={{ mb: 2 }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Button variant="outlined" onClick={handleRefresh}>
          <Refresh sx={{ mr: 1 }} />
          Làm mới
        </Button>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Thêm người dùng
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Tìm kiếm theo tên"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select
              multiple
              value={filterRoles}
              onChange={(e) => setFilterRoles(e.target.value)}
              label="Vai trò"
              renderValue={(selected) => selected.join(", ")}
            >
              {rolesData?.items?.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box height={500} width={"100%"}>
        <DataGrid
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          rows={filteredRows}
          columns={columns}
          paginationMode="server"
          rowCount={totalRows}
          page={page}
          pageSize={pageSize}
          onPageChange={(newPage) => {
            console.log("Page changed to:", newPage);
            setPage(newPage);
          }}
          onPageSizeChange={(newPageSize) => {
            console.log("Page size changed to:", newPageSize);
            setPageSize(newPageSize);
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
          getRowId={(row) => row.id}
          disableSelectionOnClick
          loading={isFetchingUsers}
          slotProps={{
            loadingOverlay: {
              variant: "linear-progress",
              noRowsVariant: "linear-progress",
            },
          }}
          localeText={{
            noRowsLabel: "Hiện tại không có người dùng nào",
          }}
        />
      </Box>

      <Dialog fullWidth open={openDialog}>
        <DialogTitle>Thêm người dùng</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Số điện thoại"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Mật khẩu"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            type="password"
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Vai trò</InputLabel>
            <Select
              multiple
              value={newUser.roleIds}
              onChange={(e) =>
                setNewUser({ ...newUser, roleIds: e.target.value })
              }
              label="Vai trò"
              renderValue={(selected) =>
                selected
                  .map(
                    (id) =>
                      rolesData?.items.find((r) => r.id === id)?.name || ""
                  )
                  .join(", ")
              }
            >
              {rolesData?.items?.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAddUser}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog}>
        <DialogTitle>Xác nhận xóa ?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng này không ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseDeleteDialog}>
            Hủy
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRestoreDialog} onClose={handleCloseRestoreDialog}>
        <DialogTitle>Xác nhận khôi phục ?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn khôi phục người dùng này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseRestoreDialog}>
            Hủy
          </Button>
          <Button
            onClick={handleRestoreUser}
            color="success"
            variant="contained"
          >
            Khôi phục
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "right", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayoutWrapper>
  );
};

export default UsersManagement;
