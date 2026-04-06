import { useState } from "react";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListDistrictsQuery,
  useListWardsByDistrictQuery,
} from "@/services/api/district";
import { skipToken } from "@reduxjs/toolkit/query";
import TableData from "@/components/TableData";

const WardsManagement = () => {
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const { data: dataDistricts } = useListDistrictsQuery({
    pageNo: 1,
    pageSize: 1000,
  });

  const {
    data: dataWardsByDistrict,
    isLoading: isLoadingWardsByDistrict,
    isError: isErrorWardsByDistrict,
    error: errorWardsByDistrict,
  } = useListWardsByDistrictQuery(
    selectedDistrictId
      ? {
          id: selectedDistrictId,
          pageNo: paginationModel.page + 1,
          pageSize: paginationModel.pageSize,
        }
      : skipToken,
  );

  const dataRowWards = selectedDistrictId
    ? dataWardsByDistrict?.result?.items
    : [];

  const totalRows = selectedDistrictId
    ? dataWardsByDistrict?.result?.totalItems
    : 0;

  const columnsWards = [
    { field: "code", headerName: "Code", width: 150 },
    { field: "name", headerName: "Tên phường / xã", width: 200 },
  ];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý phường / xã</Typography>

      <Box sx={{ my: 3, gap: { xs: 2, md: 0 } }}>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel>Chọn quận / huyện</InputLabel>
          <Select
            value={selectedDistrictId}
            label="Chọn quận / huyện"
            onChange={(e) => {
              setPaginationModel({
                page: 0,
                pageSize: paginationModel.pageSize,
              });
              setSelectedDistrictId(e.target.value);
            }}
          >
            {dataDistricts?.result?.items?.map((district) => (
              <MenuItem key={district.id} value={district.id}>
                {district.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableData
        /*
          If the row's identifier is not called id, then you need to use the getRowId prop to tell the Data Grid where it's located.
          https://mui.com/x/react-data-grid/row-definition/
         */
        getRowId={(row) => row.code}
        rows={dataRowWards}
        totalRows={totalRows}
        columnsData={columnsWards}
        loading={isLoadingWardsByDistrict}
        error={
          isErrorWardsByDistrict && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorWardsByDistrict} || "Không tải được dữ liệu."
              </Typography>
            </Box>
          )
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50]}
      />
    </DashboardLayoutWrapper>
  );
};

export default WardsManagement;
