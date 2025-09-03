import { Layout } from "react-admin";
import CustomSidebar from "./CustomSidebar";
import CustomAppBar from "./CustomAppBar";

const CustomLayout = (props) => (
  <Layout {...props} menu={CustomSidebar} appBar={CustomAppBar} />
);

export default CustomLayout;
