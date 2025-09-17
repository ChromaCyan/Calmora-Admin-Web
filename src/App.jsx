import { Admin, CustomRoutes, defaultTheme } from "react-admin";
import { Route } from "react-router-dom";
import CustomLayout from "./components/CustomLayout";
import SpecialistDashboard from "./pages/SpecialistDashboard";
import SpecialistApproval from "./pages/SpecialistApproval";
import ArticleApproval from "./pages/ArticleApproval";
import ArticleDashboard from "./pages/ArticleDashboard";
import authProvider from "./authProvider";
import dataProvider from "./dataProvider";
import MyLoginPage from "./pages/Login";

import { createTheme } from "@mui/material/styles";
import { blueGrey, deepOrange } from "@mui/material/colors";

const myTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: "dark",
    primary: blueGrey,
    secondary: deepOrange,
    background: {
      default: "transparent", 
      paper: "rgba(30, 41, 59, 0.75)",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#BBBBBB",
    },
  },
});

function App() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      loginPage={MyLoginPage}
      layout={CustomLayout}
      theme={myTheme}
    >
      <CustomRoutes>
        <Route path="/" element={<SpecialistDashboard />} />
        <Route path="/specialists-pending" element={<SpecialistApproval />} />
        <Route path="/articles-pending" element={<ArticleApproval />} />
        <Route path="/articles-dashboard" element={<ArticleDashboard />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
