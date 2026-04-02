import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Changed from ../components/layout/Navbar
import Footer from "./Footer"; // Changed from ../components/layout/Footer

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      {/* Container for the shop content */}
      <div style={{ padding: "2rem" }}>
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default PublicLayout;