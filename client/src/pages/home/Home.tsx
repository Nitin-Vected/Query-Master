import { Box} from "@mui/material";
import HeaderView from "../../template/HeaderView";
import Dashboard from "../../components/dashboard";

const Home = () => {
  return (
    <Box>
      <HeaderView />
      <Dashboard />
    </Box>
  );
};

export default Home;
