import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import "./App.css";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Variants from "./pages/variants";
import SeriesPage from "./pages/SeriesPage";
import ScrollToTop from "./utils/ScrollToTop";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { useCartSync } from "./hooks/useCartSync";
import  Contact  from "./pages/contact";
import About from "./pages/about";
import NotFound from "./pages/NotFound";
import AdminRoute from "./admin/components/AdminRoute";
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import InventoryManager from "./admin/pages/InventoryManager";
import PublicLayout from "./components/layout/PublicLayout";

function App() {
  useCartSync();

  return (
    <Router>
      <ScrollToTop />
      
      {/* IMPORTANT: We removed <Navbar />, <Footer />, and the padding <div> from here.
          They now live inside <PublicLayout /> 
      */}

      <Routes>
        {/* --- 1. PUBLIC SECTOR (Has Navbar, Footer, & Padding) --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/series/:seriesId" element={<SeriesPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/variants" element={<Variants />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
          </Route>
        </Route>

        {/* --- 2. ADMIN SECTOR (Clean Full-Screen, No Navbar/Footer) --- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="inventory" element={<InventoryManager />} />
          </Route>
        </Route>

        {/* --- 3. GLOBAL ERROR PAGE --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Keep ToastContainer outside so it works everywhere */}
      <ToastContainer 
        theme="dark"
        position="bottom-right"
        autoClose={1600}
        hideProgressBar={true}
        closeButton={false}
        toastClassName={() => 
          "relative flex p-1 min-h-10 rounded-2xl justify-between overflow-hidden cursor-pointer bg-white shadow-xl"
        }
      />
    </Router>
  );
}
export default App;

