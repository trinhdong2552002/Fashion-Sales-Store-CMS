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
} from "@mui/material";
import {
  useGetAllUsersByAdminQuery,
  useCreateUserWithRoleMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
} from "@/services/api/user";

import DashboardLayoutWrapper from "@/layouts/Dashboard_layout";
import TableData from "@/components/Table_data";
import { PreviewImage } from "@/components/Preview_image";
import { Add, Delete, Refresh, Restore } from "@mui/icons-material";

import { useSnackbar } from "@/components/Snackbar";
import StatusChip from "@/components/Status_chip";
import { useGetAllRolesByAdminQuery } from "@/services/api/role";
import UserAddDialog from "./shared/user_add_dialog";
import UserDeleteDialog from "./shared/user_delete_dialog";
import UserRestoreDialog from "./shared/user_restore_dialog";

const UserManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [previewImage, setPreviewImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToRestore, setUserToRestore] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleIds: [],
  });
  const { data: dataRoles } = useGetAllRolesByAdminQuery();
  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
    refetch: refetchUser,
  } = useGetAllUsersByAdminQuery(
    {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    },
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
        return <StatusChip status={params.value} />;
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
          (role) => role.name?.toUpperCase() === "ADMIN",
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

  const handleCloseDialogRestore = () => {
    setUserToRestore(null);
    setOpenRestoreDialog(false);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
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
      setOpenAddDialog(false);
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
      (role) => role.name?.toLowerCase() === "admin",
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

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý người dùng</Typography>

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
          onClick={() => setOpenAddDialog(true)}
        >
          Thêm người dùng
        </Button>
      </Box>

      <TableData
        rows={dataRowUsers}
        totalRows={totalRows}
        columnsData={columnsUser}
        loading={isLoadingUser}
        error={
          isErrorUser && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorUser} || Không tải được dữ liệu.
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
      />

      <UserAddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onSubmit={handleAddUser}
        newUser={newUser}
        setNewUser={setNewUser}
        submitted={submitted}
        dataRoles={dataRoles}
      />

      <UserDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteUser}
      />

      <UserRestoreDialog
        open={openRestoreDialog}
        onClose={handleCloseDialogRestore}
        onConfirm={handleRestoreUser}
      />

      <PreviewImage
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </DashboardLayoutWrapper>
  );
};

export default UserManagement;
