import { Typography } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useState } from "react";
import TableData from "@/components/TableData";
import { useGetAllRolesByAdminQuery } from "../../../../services/api/role";

const RolesManagement = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    data: dataRole,
    isLoading: isLoadingRole,
    isError: isErrorRole,
    error: errorRole,
    refetch: refetchRole,
  } = useGetAllRolesByAdminQuery(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const dataRowRoles = dataRole?.result?.items || [];
  const totalRows = dataRole?.result?.totalItems || 0;

  const columnsRoles = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên vai trò", width: 150 },
    { field: "description", headerName: "Mô tả vai trò", width: 200 },
  ];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Quản lý vai trò
      </Typography>

      <TableData
        rows={dataRowRoles}
        totalRows={totalRows}
        columnsData={columnsRoles}
        loading={isErrorRole}
        error={
          isErrorRole && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorRole} || Không tải được dữ liệu.
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 15, 20]}
      />
    </DashboardLayoutWrapper>
  );
};

export default RolesManagement;
