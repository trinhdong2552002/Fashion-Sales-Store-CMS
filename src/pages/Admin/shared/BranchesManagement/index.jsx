import React, { useState, useEffect, Component } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Box,
  PaginationItem,
  styled,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListBranchesQuery,
  useAddBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useRestoreBranchMutation,
} from "@/services/api/branches";
import { useGetMyInfoQuery } from "@/services/api/auth";
import {
  setBranches,
  setLoading as setBranchLoading,
  setError as setBranchError,
  selectBranches,
} from "@/store/redux/branches/reducer";

// Tùy chỉnh nút Back và Forward
const CustomPaginationItem = styled(PaginationItem)(({ theme }) => ({
  "&.MuiPaginationItem-previousNext": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "&.Mui-disabled": {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
    },
    borderRadius: "4px",
    margin: "0 5px",
    padding: "8px",
  },
}));

// ErrorBoundary component để bắt lỗi
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.branchesData !== this.props.branchesData &&
      this.state.hasError
    ) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error">
          Đã xảy ra lỗi khi hiển thị bảng chi nhánh.
        </Alert>
      );
    }
    return this.props.children;
  }
}

const BranchesManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const branches = useSelector(selectBranches);

  const [page, setPage] = useState(0); // Trang bắt đầu từ 0
  const [pageSize, setPageSize] = useState(10); // Mỗi trang 10 chi nhánh
  const [totalRows, setTotalRows] = useState(0); // Tổng số chi nhánh
  const [newBranch, setNewBranch] = useState({
    name: "",
    location: "",
    phone: "",
  });
  const [editBranch, setEditBranch] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Kiểm tra thông tin người dùng và quyền admin
  const {
    data: userInfo,
    error: userError,
    isLoading: userLoading,
  } = useGetMyInfoQuery();

  // Lấy danh sách chi nhánh với phân trang
  const {
    data: branchesData,
    isLoading: isFetchingBranches,
    error: fetchBranchesError,
    refetch: refetchBranches,
  } = useListBranchesQuery(
    { pageNo: page + 1, pageSize },
    {
      skip: userLoading,
      refetchOnMountOrArgChange: true,
    }
  );

  const [addBranch] = useAddBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();
  const [deleteBranch] = useDeleteBranchMutation();
  const [restoreBranch] = useRestoreBranchMutation();

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
    dispatch(setBranchLoading(isFetchingBranches));
    if (fetchBranchesError) {
      const errorMessage =
        fetchBranchesError?.data?.message || "Lỗi khi tải danh sách chi nhánh";
      dispatch(setBranchError(errorMessage));
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } else if (branchesData && branchesData.items) {
      const validBranches = branchesData.items.filter(
        (branch) => branch && branch.id && branch.name
      );
      dispatch(setBranches(validBranches));
      dispatch(setBranchError(null));
      setTotalRows(branchesData.totalItems || 0);
      console.log("Branches in state after filtering:", validBranches);
      console.log("Total rows:", branchesData.totalItems);
    } else {
      dispatch(setBranches([]));
      setTotalRows(0);
    }
  }, [branchesData, isFetchingBranches, fetchBranchesError, dispatch]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên", width: 150 },
    { field: "location", headerName: "Địa điểm", width: 200 },
    { field: "phone", headerName: "Số điện thoại", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 120 },
    { field: "createdBy", headerName: "Người tạo", width: 200 },
    { field: "updatedBy", headerName: "Người cập nhật", width: 200 },
    { field: "createdAt", headerName: "Ngày tạo", width: 120 },
    { field: "updatedAt", headerName: "Ngày cập nhật", width: 120 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="text"
            color="primary"
            onClick={() => handleEditBranch(params.row)}
          >
            Sửa
          </Button>
          {params.row.status === "ACTIVE" ? (
            <Button
              variant="text"
              color="error"
              onClick={() => handleOpenDeleteDialog(params.row.id)}
            >
              Xóa
            </Button>
          ) : (
            <Button
              variant="text"
              color="success"
              onClick={() => handleRestoreBranch(params.row.id)}
            >
              Khôi phục
            </Button>
          )}
        </>
      ),
    },
  ];

  const handleAddBranch = async () => {
    try {
      await addBranch(newBranch).unwrap();
      setNewBranch({ name: "", location: "", phone: "" });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Thêm chi nhánh thành công!",
        severity: "success",
      });
      refetchBranches();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi thêm chi nhánh";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleEditBranch = (branch) => {
    setEditBranch(branch);
    setNewBranch({
      name: branch.name,
      location: branch.location || "",
      phone: branch.phone || "",
    });
    setOpenDialog(true);
  };

  const handleUpdateBranch = async () => {
    try {
      await updateBranch({
        id: editBranch.id,
        ...newBranch,
      }).unwrap();
      setEditBranch(null);
      setNewBranch({ name: "", location: "", phone: "" });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Cập nhật chi nhánh thành công!",
        severity: "success",
      });
      refetchBranches();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi cập nhật chi nhánh";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setBranchToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteBranch = async () => {
    try {
      await deleteBranch(branchToDelete).unwrap();
      setOpenDeleteDialog(false);
      setBranchToDelete(null);
      setSnackbar({
        open: true,
        message: "Xóa chi nhánh thành công!",
        severity: "success",
      });
      refetchBranches();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi xóa chi nhánh";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleRestoreBranch = async (id) => {
    try {
      await restoreBranch(id).unwrap();
      setSnackbar({
        open: true,
        message: "Khôi phục chi nhánh thành công!",
        severity: "success",
      });
      refetchBranches();
    } catch (error) {
      const errorMessage = error.data?.message || "Lỗi khi khôi phục chi nhánh";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditBranch(null);
    setNewBranch({ name: "", location: "", phone: "" });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setBranchToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    setPage(0);
    refetchBranches();
    setSnackbar({
      open: true,
      message: "Danh sách chi nhánh đã được làm mới!",
      severity: "info",
    });
  };

  if (userLoading || isFetchingBranches) {
    return <CircularProgress />;
  }

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Chi nhánh
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={9}>
          <Button variant="outlined" onClick={handleRefresh}>
            <RefreshIcon sx={{ mr: 1 }} />
            Làm mới
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            fullWidth
          >
            Thêm chi nhánh
          </Button>
        </Grid>
      </Grid>

      {fetchBranchesError ? (
        <Alert severity="error">
          {fetchBranchesError?.data?.message || "Lỗi khi tải chi nhánh"}
        </Alert>
      ) : branches.length === 0 ? (
        <Alert severity="info">Hiện tại không có chi nhánh nào.</Alert>
      ) : (
        <ErrorBoundary branchesData={branchesData}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={branches}
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
              loading={isFetchingBranches}
              localeText={{
                noRowsLabel: "Hiện tại không có chi nhánh nào",
              }}
              slots={{
                pagination: () => (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={2}
                  >
                    <Typography variant="body2">
                      Tổng số chi nhánh: {totalRows}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <CustomPaginationItem
                        type="previous"
                        component={Button}
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                      />
                      <Typography variant="body2" mx={2}>
                        Trang {page + 1} / {Math.ceil(totalRows / pageSize)}
                      </Typography>
                      <CustomPaginationItem
                        type="next"
                        component={Button}
                        disabled={page >= Math.ceil(totalRows / pageSize) - 1}
                        onClick={() => setPage(page + 1)}
                      />
                    </Box>
                  </Box>
                ),
              }}
            />
          </div>
        </ErrorBoundary>
      )}

      {/* Dialog thêm/sửa chi nhánh */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="branch-dialog-title"
        aria-describedby="branch-dialog-description"
      >
        <DialogTitle id="branch-dialog-title">
          {editBranch ? "Sửa chi nhánh" : "Thêm chi nhánh"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            value={newBranch.name}
            onChange={(e) =>
              setNewBranch({ ...newBranch, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="Địa điểm"
            value={newBranch.location}
            onChange={(e) =>
              setNewBranch({ ...newBranch, location: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Số điện thoại"
            value={newBranch.phone}
            onChange={(e) =>
              setNewBranch({ ...newBranch, phone: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCloseDialog}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={editBranch ? handleUpdateBranch : handleAddBranch}
          >
            {editBranch ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa chi nhánh
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa chi nhánh này không? Hành động này không
            thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteBranch} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
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

export default BranchesManagement;