import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  // You can also check auth here or use context

  return (
    <>
      {/* Optional: Add a header or wrapper here */}
      <Outlet /> {/* This renders the nested child routes */}
    </>
  );
};

export default ProtectedLayout;
