import { Fragment } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { Delete, Edit, Restore } from "@mui/icons-material";

const ProductTable = ({
  rows,
  totalRows,
  loading,
  paginationModel,
  onPaginationModelChange,
  onEdit,
  onDelete,
  onRestore,
}) => {
  const columnsProduct = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên sản phẩm", width: 400 },
    { field: "description", headerName: "Mô tả", width: 500 },
    { field: "isAvailable", headerName: "Có sẵn", width: 150 },
    { field: "averageRating", headerName: "Đánh giá trung bình", width: 150 },
    { field: "soldQuantity", headerName: "Số lượng đã bán", width: 150 },
    { field: "totalReviews", headerName: "Tổng đánh giá", width: 150 },
    { field: "createdAt", headerName: "Ngày tạo", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <Fragment>
          <IconButton onClick={() => onEdit(params.row.id)}>
            <Edit color="primary" />
          </IconButton>
          {params.row.status === "INACTIVE" ? (
            <IconButton onClick={() => onRestore(params.row.id)}>
              <Restore color="success" />
            </IconButton>
          ) : (
            <IconButton onClick={() => onDelete(params.row.id)}>
              <Delete color="error" />
            </IconButton>
          )}
        </Fragment>
      ),
    },
  ];

  return (
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
      columns={columnsProduct}
      rowCount={totalRows}
      loading={loading}
      disableSelectionOnClick
      localeText={{
        noRowsLabel: "Hiện tại không có sản phẩm nào",
      }}
      pagination
      paginationMode="server"
      sortingMode="server"
      filterMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={[10, 15, 20]}
    />
  );
};

export default ProductTable;
