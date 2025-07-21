import { Fragment } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { Delete, Edit, Restore } from "@mui/icons-material";

const TableData = ({
  rows,
  totalRows,
  columnsData,
  loading,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions
}) => {
  return (
    <Box height={600}>
      <DataGrid
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: "primary.light",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
        rows={rows}
        columns={columnsData}
        rowCount={totalRows}
        loading={loading}
        disableSelectionOnClick
        localeText={{
          noRowsLabel: "Không có dữ liệu",
        }}
        pagination
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={pageSizeOptions}
      />
    </Box>
  );
};

export default TableData;
