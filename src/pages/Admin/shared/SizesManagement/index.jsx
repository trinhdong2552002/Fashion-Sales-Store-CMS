import { useState } from "react";
import { Box, Typography } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListSizesQuery } from "@/services/api/size";

import TableData from "@/components/TableData";

const SizesManagement = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    data: dataSize,
    isLoading: isLoadingSize,
    isError: isErrorSize,
    error: errorSize,
  } = useListSizesQuery(
    {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const dataRowSizes = dataSize?.result?.items || [];
  const totalRows = dataSize?.result?.totalItems || 0;

  const columnsSize = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên kích thước", width: 200 },
  ];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý kích thước</Typography>

      <TableData
        rows={dataRowSizes}
        totalRows={totalRows}
        columnsData={columnsSize}
        loading={isLoadingSize}
        error={
          isLoadingSize && (
            <Box mt={2} textAlign="center">
            <Typography color="error">
                {errorSize} || Không tải được dữ liệu.
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

export default SizesManagement;
