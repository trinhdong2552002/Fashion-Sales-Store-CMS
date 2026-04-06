import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useState } from "react";
import { useListDistrictsByProvinceQuery } from "@/services/api/province";
import { useListProvincesQuery } from "@/services/api/province";
import { skipToken } from "@reduxjs/toolkit/query";
import TableData from "@/components/TableData";

const DistrictsManagement = () => {
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const { data: dataProvince } = useListProvincesQuery({
    pageNo: 1,
    pageSize: 100,
  });

  const {
    data: dataDistrictsByProvince,
    isLoading: isLoadingDistrictsByProvince,
    isError: isErrorDistrictsByProvince,
    error: errorDistrictsByProvince,
  } = useListDistrictsByProvinceQuery(
    selectedProvinceId
      ? {
          id: selectedProvinceId,
          page: paginationModel.page,
          size: paginationModel.pageSize,
        }
      : skipToken,
  );

  const dataRowDistricts = selectedProvinceId
    ? dataDistrictsByProvince?.result?.items
    : [];

  const totalRows = selectedProvinceId
    ? dataDistrictsByProvince?.result?.totalItems
    : 0;

  const columnsDistrict = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Tên quận / huyện", width: 200 },
  ];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5">Quản lý quận / huyện</Typography>

      <Box sx={{ my: 3, }}>
        <FormControl
          sx={{
            minWidth: {
              xs: "100%",
              sm: 300,
            },
          }}
        >
          <InputLabel>Chọn tỉnh / thành phố</InputLabel>
          <Select
            value={selectedProvinceId}
            label="Chọn tỉnh / thành phố"
            onChange={(e) => {
              setPaginationModel({
                page: 0,
                pageSize: paginationModel.pageSize,
              });
              setSelectedProvinceId(e.target.value);
            }}
          >
            {dataProvince?.result?.items?.map((province) => (
              <MenuItem key={province.id} value={province.id}>
                {province.name}
              </MenuItem>
            ))}
            ‰
          </Select>
        </FormControl>
      </Box>

      <TableData
        rows={dataRowDistricts}
        totalRows={totalRows}
        columnsData={columnsDistrict}
        loading={isLoadingDistrictsByProvince}
        error={
          isErrorDistrictsByProvince && (
            <Box mt={2} textAlign="center">
              <Typography color="error">
                {errorDistrictsByProvince} || "Không tải được dữ liệu."
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

export default DistrictsManagement;
