import { Admin, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import CustomLayout from "./components/CustomLayout";
import SpecialistDashboard from "./pages/SpecialistDashboard";
import SpecialistApproval from "./pages/SpecialistApproval";
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
          path="/specialists-dashboard"
          element={<SpecialistDashboard />}
        />
        <Route
          path="/specialists-pending"
          element={<SpecialistApproval />}
        />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
