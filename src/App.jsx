import { Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/admin-page/page-not-found";
import { PrivateRoute, PublicRoute } from "./components/protected-route";

// Layout imports
import AdminLayout from "./layouts/admin-layout";

// Page imports
import Login from "./pages/login-page";
import AdminPage from "./pages/admin-page";
import ColorManagement from "./pages/admin-page/shared/color-management";
import AddressManagement from "./pages/admin-page/shared/address-management";
import UserManagement from "./pages/admin-page/shared/user-management";
import OrderManagement from "./pages/admin-page/shared/order-management";
import FileManagement from "./pages/admin-page/shared/file-management";
import ProductManagement from "./pages/admin-page/shared/product-management";
import ProductVariantManagement from "./pages/admin-page/shared/product-variant-management";
import CategoryManagement from "./pages/admin-page/shared/category-management";
import BranchManagement from "./pages/admin-page/shared/branch-management";
import RoleManagement from "./pages/admin-page/shared/role-management";
import PromotionManagement from "./pages/admin-page/shared/promotion-management";
import PaymentHistoryManagement from "./pages/admin-page/shared/payment-history-management";

const App = () => {
  return (
    <Routes>
      {/* Check route not found */}
      <Route path="*" element={<PageNotFound />} />

      {/* Route public */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* Route private */}
      {/* TODO: Set PrivateRoute if the browser not found token or expired token it will return the page login */}
      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard-management" element={<AdminPage />} />
          <Route path="product-management" element={<ProductManagement />} />
          <Route path="file-management" element={<FileManagement />} />
          <Route
            path="product-variant-management"
            element={<ProductVariantManagement />}
          />
          <Route path="color-management" element={<ColorManagement />} />
          <Route path="address-management" element={<AddressManagement />} />
          <Route path="category-management" element={<CategoryManagement />} />
          <Route path="order-management" element={<OrderManagement />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="branch-management" element={<BranchManagement />} />
          <Route
            path="promotion-management"
            element={<PromotionManagement />}
          />
          <Route path="role-management" element={<RoleManagement />} />
          <Route
            path="payment-history-management"
            element={<PaymentHistoryManagement />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
