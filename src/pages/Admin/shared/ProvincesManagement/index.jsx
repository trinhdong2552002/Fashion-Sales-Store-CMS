import { useState } from "react";
import { Box, Typography } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListProvincesQuery } from "@/services/api/province";
import TableData from "@/components/TableData";

const ProvincesManagement = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    data: dataProvince,
    isLoading: isLoadingProvince,
    isError: isErrorProvince,
    error: errorProvince,
  } = useListProvincesQuery(
    {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const dataRowProvinces = dataProvince?.result?.items || [];
  const totalRows = dataProvince?.result?.totalItems || 0;

  const columnsProvince = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên tỉnh / thành phố", width: 200 },
  ];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Quản lý tỉnh / thành phố
      </Typography>

      <TableData
        rows={dataRowProvinces}
        totalRows={totalRows}
        columnsData={columnsProvince}
        loading={isLoadingProvince}
        error={
          isErrorProvince && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorProvince} || Không tải được dữ liệu.
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

export default ProvincesManagement;
