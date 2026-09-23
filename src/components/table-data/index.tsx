import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

interface TableDataProps {
  getRowId: (row: any) => string | number;
  rows: any[];
  totalRows: number;
  columnsData: any[];
  loading: boolean;
  error?: any;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  pageSizeOptions: number[];
}

const TableData = ({
  getRowId,
  rows,
  totalRows,
  columnsData,
  loading,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions,
}: TableDataProps) => {
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
        getRowId={getRowId}
        rows={rows}
        columns={columnsData}
        rowCount={totalRows}
        loading={loading}
        slotProps={{
          loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "linear-progress",
          },
        }}
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
