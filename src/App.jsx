import { Route, Routes } from "react-router-dom";
import Login from "@/pages/LoginPage";
import AdminLayout from "./layouts/AdminLayout";
import Admin from "./pages/Admin";
import ProductsManagement from "./pages/Admin/shared/ProductsManagement";
import CategoriesManagement from "./pages/Admin/shared/CategoriesManagement";
import OrdersManagement from "./pages/Admin/shared/OrdersManagement";
import UsersManagement from "./pages/Admin/shared/UsersManagement";
import BranchesManagement from "./pages/Admin/shared/BranchesManagement";
import PromotionsManagement from "./pages/Admin/shared/PromotionsManagement";
import PaymentHistoriesManagement from "./pages/Admin/shared/PaymentHistoriesManagement";
import RolesManagement from "./pages/Admin/shared/RolesManagement";
import PermissionsManagement from "./pages/Admin/shared/PermissionsManagement";
import ColorsManagement from "./pages/Admin/shared/ColorsManagement";
import SizesManagement from "./pages/Admin/shared/SizesManagement";
import WardsManagement from "./pages/Admin/shared/WardsManagement";
import DistrictsManagement from "./pages/Admin/shared/DistrictsManagement";
import ProvincesManagement from "./pages/Admin/shared/ProvincesManagement";
import ProductImagesManagement from "./pages/Admin/shared/ProductImagesManagement";
import ProductVariantsManagement from "./pages/Admin/shared/ProductVariantsManagement";
import AddressManagement from "./pages/Admin/shared/AddressManagement";
import { PrivateRoute, PublicRoute } from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Route public */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* Route private */}
      {/* TODO: Set PrivateRoute if the browser not found token or expired token it will return the page login */}
      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Admin />} />
          <Route path="productsManagement" element={<ProductsManagement />} />
          <Route
            path="productImagesManagement"
            element={<ProductImagesManagement />}
          />
          <Route
            path="productVariantsManagement"
            element={<ProductVariantsManagement />}
          />
          <Route path="colorsManagement" element={<ColorsManagement />} />
          <Route path="sizesManagement" element={<SizesManagement />} />
          <Route path="wardsManagement" element={<WardsManagement />} />
          <Route path="districtsManagement" element={<DistrictsManagement />} />
          <Route path="provincesManagement" element={<ProvincesManagement />} />
          <Route path="addressManagement" element={<AddressManagement />} />
          <Route
            path="categoriesManagement"
            element={<CategoriesManagement />}
          />
          <Route path="ordersManagement" element={<OrdersManagement />} />
          <Route path="usersManagement" element={<UsersManagement />} />
          <Route path="branchesManagement" element={<BranchesManagement />} />
          <Route
            path="promotionsManagement"
            element={<PromotionsManagement />}
          />
          <Route path="rolesManagement" element={<RolesManagement />} />
          <Route
            path="permissionsManagement"
            element={<PermissionsManagement />}
          />
          <Route
            path="paymentHistoriesManagement"
            element={<PaymentHistoriesManagement />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
