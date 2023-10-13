import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
const PageLoader = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        height: "100vh",
        display: "flex",
      }}
      className="items-center justify-center"
    >
      <CircularProgress />
    </Box>
  );
};
export default PageLoader;
