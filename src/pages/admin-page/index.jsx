import { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { LineChart, BarChart } from "@mui/x-charts";
import DashboardLayoutWrapper from "@/layouts/dashboard-layout";
import { GetApp } from "@mui/icons-material";
import { useSnackbar } from "@/components/Snackbar";

// Mockup
import { monthly_revenue } from "@/mocks/monthly-revenue";
import { top_selling_products } from "@/mocks/top-selling-products";
import { order_summary } from "@/mocks/order-summary";

// Components
import TableData from "@/components/table-data";
import RevenueCard from "./shared/revenue-card";
import OrdersCard from "./shared/orders-card";
import CompletedCard from "./shared/completed-card";
import PendingCancelCard from "./shared/pending-cancel-card";

// Datepicker & dayjs integrations
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Hooks Query
import {
  useGetMonthlyRevenueQuery,
  useGetTopSellingProductsQuery,
  useGetOrderSummaryQuery,
  useLazyGetExportOrderRevenueToExcelQuery,
} from "@/services/api/statistics";

const AdminPage = () => {
  const { showSnackbar } = useSnackbar();
  const [triggerExport] = useLazyGetExportOrderRevenueToExcelQuery();

  const [isExporting, setIsExporting] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Date filter states (defaulting to last 6 months)
  const [startDate, setStartDate] = useState(
    dayjs().subtract(5, "month").startOf("month"),
  );
  const [endDate, setEndDate] = useState(dayjs());

  // Formatted date queries
  const queryParams = {
    startDate: startDate ? startDate.format("YYYY-MM-DD") : "",
    endDate: endDate ? endDate.format("YYYY-MM-DD") : "",
  };

  // Fetch API Queries with parameters
  const {
    data: dataMonthly,
    isLoading: isLoadingMonthly,
    isError: isErrorMonthly,
  } = useGetMonthlyRevenueQuery(queryParams, {
    refetchOnMountOrArgChange: true,
    skip: !startDate || !endDate,
  });

  const {
    data: dataTopProducts,
    isLoading: isLoadingTopProducts,
    isError: isErrorTopProducts,
  } = useGetTopSellingProductsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
    skip: !startDate || !endDate,
  });

  const {
    data: dataSummary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useGetOrderSummaryQuery(queryParams, {
    refetchOnMountOrArgChange: true,
    skip: !startDate || !endDate,
  });

  // Resolve Monthly Revenue Data
  const monthlyRevenueData = dataMonthly?.result || dataMonthly || [];
  const activeMonthlyRevenue =
    monthlyRevenueData.length > 0 ? monthlyRevenueData : monthly_revenue;

  // Resolve Top Selling Products Data
  const rawTopProducts = dataTopProducts?.result || dataTopProducts || [];
  const activeTopProducts =
    rawTopProducts.length > 0 ? rawTopProducts : top_selling_products;

  // Resolve Order Summary Data
  const summaryData = dataSummary?.result || dataSummary || {};
  const totalRevenue =
    summaryData.totalRevenue ??
    summaryData.revenue ??
    order_summary.totalRevenue;
  const totalOrders =
    summaryData.totalOrders ?? summaryData.orders ?? order_summary.totalOrders;

  const orderStatusMap = summaryData.statusSummary || {};
  const pendingOrders =
    orderStatusMap.PENDING ??
    summaryData.pendingOrders ??
    order_summary.statusSummary.PENDING;
  const completedOrders =
    orderStatusMap.COMPLETED ??
    summaryData.completedOrders ??
    order_summary.statusSummary.COMPLETED;
  const cancelledOrders =
    orderStatusMap.CANCELLED ??
    summaryData.cancelledOrders ??
    order_summary.statusSummary.CANCELLED;

  // Formatting helpers
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatMonth = (m) => {
    if (!m) return "";
    if (typeof m === "string") return m;
    if (typeof m === "object") {
      if (m.month && m.year) {
        return `${m.month}/${m.year}`;
      }
      return JSON.stringify(m);
    }
    return String(m);
  };

  // Columns for Top Selling Products DataGrid
  const columnsTopProducts = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      renderCell: (params) => (
        <Box sx={{ fontWeight: params.value === 1 ? 700 : 500 }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "Sản phẩm",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "sold",
      headerName: "Đã bán",
      width: 120,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "revenue",
      headerName: "Doanh thu",
      width: 180,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Box sx={{ fontWeight: 600 }}>{formatCurrency(params.value)}</Box>
      ),
    },
  ];

  // Map and Paginate activeTopProducts for local/virtual pagination inside Server-mode DataGrid
  const mappedTopProducts = activeTopProducts.map((p, idx) => ({
    id: p.productId || p.id || `product-${idx}`,
    rank: idx + 1,
    name: p.productName || p.name || "Sản phẩm",
    sold: p.soldQuantity ?? p.sold ?? 0,
    revenue: p.totalRevenue ?? p.revenue ?? 0,
  }));

  const startIndex = paginationModel.page * paginationModel.pageSize;
  const endIndex = startIndex + paginationModel.pageSize;
  const paginatedTopProducts = mappedTopProducts.slice(startIndex, endIndex);

  const triggerMockupCsvExport = () => {
    const headers = ["Mục tiêu", "Giá trị", "Chú thích"];
    const rows = [
      ["Tổng doanh thu", totalRevenue.toString(), "Doanh thu VND"],
      ["Tổng đơn hàng", totalOrders.toString(), "Đơn hàng"],
      ["Đơn hoàn thành", completedOrders.toString(), "Đã giao thành công"],
      ["Đơn chờ xử lý", pendingOrders.toString(), "Đang chuẩn bị"],
      ["Đơn đã hủy", cancelledOrders.toString(), "Đã hủy bỏ"],
      [],
      ["Bảng kê doanh thu hàng tháng", "", ""],
      ["Tháng", "Doanh thu (VND)", ""],
      ...activeMonthlyRevenue.map((item) => [
        formatMonth(item.month),
        (item.totalAmount ?? item.revenue ?? 0).toString(),
        "",
      ]),
      [],
      ["Top sản phẩm bán chạy", "", ""],
      ["Tên sản phẩm", "Số lượng đã bán", "Doanh thu (VND)"],
      ...activeTopProducts.map((p) => [
        p.productName || p.name || "Sản phẩm",
        (p.soldQuantity ?? p.sold ?? 0).toString(),
        (p.totalRevenue ?? p.revenue ?? 0).toString(),
      ]),
    ];

    const csvContent =
      "\uFEFF" +
      rows
        .map((row) =>
          row.map((val) => `"${val.replace(/"/g, '""')}"`).join(","),
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `order-revenue-${startDate.format("YYYY-MM-DD")}-${endDate.format("YYYY-MM-DD")}.csv`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);

    showSnackbar(
      "Lưu ý: Đã xuất báo cáo Demo (CSV) do không kết nối được API xuất Excel!",
      "warning",
    );
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const result = await triggerExport(queryParams).unwrap();

      if (!result) {
        throw new Error("Không nhận được dữ liệu báo cáo");
      }

      const blob = new Blob([result], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `order-revenue-${startDate.format("YYYY-MM-DD")}-${endDate.format("YYYY-MM-DD")}.xlsx`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 200);

      showSnackbar("Xuất báo cáo Excel thành công!", "success");
    } catch (error) {
      console.warn("API export failed, performing mockup CSV download", error);
      triggerMockupCsvExport();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayoutWrapper>
      {/* Top Banner & Title Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
          >
            Tổng quan Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Theo dõi doanh số và báo cáo kinh doanh của cửa hàng
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="success"
          startIcon={<GetApp />}
          onClick={handleExportExcel}
          disabled={isExporting}
          sx={{
            px: 3,
            py: 1.2,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {isExporting ? "Đang xuất file..." : "Xuất báo cáo doanh thu Excel"}
        </Button>
      </Box>

      {/* Date Filter Card */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card
          sx={{
            mb: 4,
            p: 2.5,
            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            borderRadius: "12px",
            backgroundColor: "#fff",
            border: "1px solid #f1f5f9",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DatePicker
                label="Từ ngày"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DatePicker
                label="Đến ngày"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setStartDate(dayjs().subtract(7, "day"));
                    setEndDate(dayjs());
                  }}
                  sx={{
                    textTransform: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    borderColor: "#e2e8f0",
                    color: "#475569",
                  }}
                >
                  7 ngày qua
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setStartDate(dayjs().subtract(30, "day"));
                    setEndDate(dayjs());
                  }}
                  sx={{
                    textTransform: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    borderColor: "#e2e8f0",
                    color: "#475569",
                  }}
                >
                  30 ngày qua
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setStartDate(dayjs().subtract(5, "month").startOf("month"));
                    setEndDate(dayjs());
                  }}
                  sx={{
                    textTransform: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    borderColor: "#e2e8f0",
                    color: "#475569",
                  }}
                >
                  6 tháng qua
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </LocalizationProvider>

      {/* Summary KPI Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Revenue Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RevenueCard value={totalRevenue} formatCurrency={formatCurrency} />
        </Grid>

        {/* Total Orders Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <OrdersCard value={totalOrders} />
        </Grid>

        {/* Completed Orders Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CompletedCard value={completedOrders} />
        </Grid>

        {/* Pending & Cancelled Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PendingCancelCard
            pending={pendingOrders}
            cancelled={cancelledOrders}
          />
        </Grid>
      </Grid>

      {/* Main Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Revenue Area Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              borderRadius: "12px",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}
              >
                Doanh thu 6 tháng gần nhất
              </Typography>
              <Box sx={{ width: "100%", height: 320 }}>
                <LineChart
                  xAxis={[
                    {
                      data: activeMonthlyRevenue.map((d) =>
                        formatMonth(d.month),
                      ),
                      scaleType: "point",
                    },
                  ]}
                  series={[
                    {
                      data: activeMonthlyRevenue.map(
                        (d) => d.totalAmount ?? d.revenue ?? 0,
                      ),
                      label: "Doanh thu (VND)",
                      color: "#3b82f6",
                      area: true,
                    },
                  ]}
                  height={300}
                  margin={{ top: 20, bottom: 40, left: 70, right: 20 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Status Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              borderRadius: "12px",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}
              >
                Thống kê trạng thái đơn hàng
              </Typography>
              <Box sx={{ width: "100%", height: 320 }}>
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: ["Chờ xử lý", "Hoàn thành", "Đã hủy"],
                    },
                  ]}
                  series={[
                    {
                      data: [pendingOrders, completedOrders, cancelledOrders],
                      label: "Số lượng đơn hàng",
                      color: "#10b981",
                    },
                  ]}
                  height={300}
                  margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Selling Products List & Bar Chart */}

      {/* Top Selling Bar Chart */}

      <Card
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          borderRadius: "12px",
          mb: 4,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}
          >
            Thống kê doanh số top sản phẩm (Số lượng)
          </Typography>
          <Box sx={{ width: "100%", height: 320 }}>
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: activeTopProducts.map((p) => {
                    const name = p.name || p.productName || "Sản phẩm";
                    return name.length > 12
                      ? name.substring(0, 12) + "..."
                      : name;
                  }),
                },
              ]}
              series={[
                {
                  data: activeTopProducts.map((p) => p.sold ?? p.quantity ?? 0),
                  label: "Đã bán (Sản phẩm)",
                  color: "#f59e0b",
                },
              ]}
              height={300}
              margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Detailed Table Grid */}

      <Card
        sx={{
          height: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          borderRadius: "12px",
        }}
      >
        <CardContent
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}
          >
            Sản phẩm bán chạy nhất
          </Typography>

          <TableData
            rows={paginatedTopProducts}
            totalRows={activeTopProducts.length}
            columnsData={columnsTopProducts}
            loading={isLoadingTopProducts}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>
    </DashboardLayoutWrapper>
  );
};

export default AdminPage;
