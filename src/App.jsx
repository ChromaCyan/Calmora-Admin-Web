import { Admin, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import CustomLayout from "./components/CustomLayout";
import SpecialistDashboard from "./pages/SpecialistDashboard";
import SpecialistApproval from "./pages/SpecialistApproval";
import ArticleApproval from "./pages/ArticleApproval";
import ArticleDashboard from "./pages/ArticleDashboard";
import authProvider from "./authProvider";
import dataProvider from "./dataProvider";
import MyLoginPage from "./pages/Login";

function App() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      loginPage={MyLoginPage}
      layout={CustomLayout}
    >
      <CustomRoutes>
        <Route
          path="/"
          element={<SpecialistDashboard />}
        />
        <Route
          path="/specialists-pending"
          element={<SpecialistApproval />}
        />
        <Route
          path="/articles-pending"
          element={<ArticleApproval />}
        />
        <Route
          path="/articles-dashboard"
          element={<ArticleDashboard />}
        />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
