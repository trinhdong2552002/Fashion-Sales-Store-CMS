import { Route, Routes } from "react-router-dom";
import Login from "@/pages/Login_page";
import { PrivateRoute, PublicRoute } from "./components/Protected_route";

import AdminPage from "./pages/Admin_page";
import AdminLayout from "./layouts/Admin_layout";
import CategoryManagement from "./pages/Admin_page/shared/Category_management";
import BranchesManagement from "./pages/Admin_page/shared/Branch_management";
import PromotionsManagement from "./pages/Admin_page/shared/Promotion_management";
import PaymentHistoriesManagement from "./pages/Admin_page/shared/Payment_history_management";
import RolesManagement from "./pages/Admin_page/shared/Role_management";
import ColorsManagement from "./pages/Admin_page/shared/Color_management";
import AddressManagement from "./pages/Admin_page/shared/Address_management";
import PageNotFound from "./pages/Admin_page/Page_not_found";
import FileManagement from "./pages/Admin_page/shared/File_management";
import ProductManagement from "./pages/Admin_page/shared/Product_management";
import ColorManagement from "./pages/Admin_page/shared/Color_management";
import BranchManagement from "./pages/Admin_page/shared/Branch_management";
import OrderManagement from "./pages/Admin_page/shared/Order_management";
import ProductVariantManagement from "./pages/Admin_page/shared/Product_variant_management";
import UserManagement from "./pages/Admin_page/shared/User_management";

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
            element={<PromotionsManagement />}
          />
          <Route path="role-management" element={<RolesManagement />} />
          <Route
            path="payment-history-management"
            element={<PaymentHistoriesManagement />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
