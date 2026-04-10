import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";                                            
import Footer from "./Footer"; 

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