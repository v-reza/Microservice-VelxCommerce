import React, { lazy, Suspense } from "react";
import LinearProgress from "@mui/material/LinearProgress";
const Product = lazy(() => import("../../components/Product/Product"));
const Dashboard = ({ navbarRefresh, setNavbarRefresh }) => {
  return (
    <>
      <Suspense fallback={<LinearProgress />}>
        <div className="container">
          <Product setNavbarRefresh={setNavbarRefresh} />
        </div>
      </Suspense>
    </>
  );
};

export default Dashboard;
