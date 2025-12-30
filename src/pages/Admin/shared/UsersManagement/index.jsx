import { useState } from "react";
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
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import {
  useListUsersForAdminQuery,
  useCreateUserWithRoleMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
} from "@/services/api/user";
import { useListRolesQuery } from "@/services/api/role";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import TableData from "@/components/TableData";
import ErrorDisplay from "@/components/ErrorDisplay";
import { PreviewImage } from "@/components/PreviewImage";
import { Add, Delete, Refresh, Restore } from "@mui/icons-material";
import { statusDisplay } from "/src/constants/badgeStatus";
import { useSnackbar } from "@/components/Snackbar";

const UsersManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [previewImage, setPreviewImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToRestore, setUserToRestore] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleIds: [],
  });
  const { data: dataRoles } = useListRolesQuery();
  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    refetch: refetchUser,
  } = useListUsersForAdminQuery(
    {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [createUserWithRole] = useCreateUserWithRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();

  const dataRowUsers = dataUser?.result?.items || [];
  const totalRows = dataUser?.result?.totalItems || 0;

  const columnsUser = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên người dùng", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 200,
      renderCell: (params) => {
        const display = statusDisplay[params.value] || {
          label: "Không rõ",
          color: "default",
        };
        return (
          <Chip
            label={display.label}
            color={display.color}
            variant={display.variant}
          />
        );
      },
    },
    {
      field: "avatarUrl",
      headerName: "Hình ảnh người dùng",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.row.avatarUrl}
          alt={params.row.name}
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => setPreviewImage(params.value)}
        />
      ),
    },
    {
      field: "dob",
      headerName: "Ngày sinh",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.value
            ? new Date(params.row.dob).toLocaleDateString("vi-VN")
            : "--"}
        </div>
      ),
    },
    {
      field: "gender",
      headerName: "Giới tính",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.value === "MALE"
            ? "Nam"
            : params.value === "FEMALE"
            ? "Nữ"
            : "--"}
        </div>
      ),
    },
    {
      field: "createdBy",
      headerName: "Người tạo",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.createdBy || "--"}
        </div>
      ),
    },
    {
      field: "updatedBy",
      headerName: "Người cập nhật",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.updatedBy || "--"}
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.createdAt
            ? new Date(params.row.createdAt).toLocaleDateString("vi-VN")
            : "N/A"}
        </div>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Ngày cập nhật",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row.updatedAt
            ? new Date(params.row.updatedAt).toLocaleDateString("vi-VN")
            : "--"}
        </div>
      ),
    },
    {
      field: "roles",
      headerName: "Vai trò",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.value ? "normal" : "#888" }}>
          {params.row?.roles?.map((role) => role.name).join(", ") || "--"}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => {
        const isAdmin = params.row?.roles?.some(
          (role) => role.name?.toUpperCase() === "ADMIN"
        );
        if (isAdmin) {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography>Không thể xóa Admin</Typography>
            </Box>
          );
        }
        return (
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
        );
      },
    },
  ];

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

  const handleRefresh = () => {
    refetchUser();
    showSnackbar("Danh sách người dùng đã được làm mới!", "info");
  };

  const handleAddUser = async () => {
    setSubmitted(true);

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
      showSnackbar("Thêm người dùng thành công!", "success");
      refetchUser();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleDeleteUser = async () => {
    const user = dataRowUsers.find((u) => u.id === userToDelete);
    const isAdmin = user?.roles?.some(
      (role) => role.name?.toLowerCase() === "admin"
    );
    if (isAdmin) {
      showSnackbar("Không thể xóa người dùng Admin!", "error");
      setOpenDeleteDialog(false);
      setUserToDelete(null);
      return;
    }
    try {
      const response = await deleteUser(userToDelete).unwrap();
      if (response) {
        setOpenDeleteDialog(false);
        setUserToDelete(null);
        showSnackbar("Xóa người dùng thành công!", "success");
      }

      refetchUser();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  const handleRestoreUser = async () => {
    try {
      await restoreUser(userToRestore).unwrap();
      showSnackbar("Khôi phục người dùng thành công!", "success");
      setOpenRestoreDialog(false);
      setUserToRestore(null);
      refetchUser();
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(error.data.message, "error");
      }
    }
  };

  if (isErrorUser) {
    <ErrorDisplay
      error={{
        message: "Không tải được danh sách người dùng.",
      }}
    />;
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý Người dùng</Typography>

      <Box
        sx={{
          mt: 3,
          mb: 3,
          gap: {
            xs: 2,
            md: 0,
          },
        }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={{
          xs: "stretch",
          sm: "center",
          md: "center",
        }}
        flexDirection={{
          xs: "column",
          sm: "row",
          md: "row",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            fontSize: "1rem",
          }}
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
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

      <TableData
        rows={dataRowUsers}
        totalRows={totalRows}
        columnsData={columnsUser}
        loading={isLoadingUser}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 15, 20]}
      />

      <Dialog fullWidth open={openDialog}>
        <DialogTitle>Thêm người dùng</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newUser.name}
            helperText={
              submitted && !newUser.name ? "name không được để trống" : ""
            }
          />
          <TextField
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newUser.email}
            helperText={
              submitted && !newUser.email ? "email không được để trống" : ""
            }
          />
          <TextField
            label="Số điện thoại"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
            error={submitted && !newUser.phone}
            helperText={
              submitted && !newUser.phone ? "phone không được để trống" : ""
            }
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
            error={submitted && !newUser.password}
            helperText={
              submitted && !newUser.password
                ? "password không được để trống"
                : ""
            }
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
                      dataRoles?.result?.items.find((r) => r.id === id)?.name ||
                      ""
                  )
                  .join(", ")
              }
            >
              {dataRoles?.result?.items?.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => setOpenDialog(false)}
          >
            Hủy
          </Button>
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
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={handleCloseDeleteDialog}
          >
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
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="error"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={handleCloseRestoreDialog}
          >
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

      <PreviewImage
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </DashboardLayoutWrapper>
  );
};

export default UsersManagement;
