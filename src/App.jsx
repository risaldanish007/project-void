import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/layout/Navbar";
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
import Footer from "./components/layout/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { useCartSync } from "./hooks/useCartSync";

function App(){
  useCartSync();

  return(
    <Router>
      <ScrollToTop/>
      <Navbar/>
        
        <div style={{padding: '2rem'}}>
          {/* nav links */}
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
              {/*dynamic route|*/}
              <Route path="/series/:seriesId" element={<SeriesPage />} />
              <Route path="/product/:id" element={<ProductDetail/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/variants" element={<Variants />} />
              {/* protected Routes */}
              <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile/>
                </ProtectedRoute>         
              }/>
              <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout/>
                </ProtectedRoute>          
              }/>
              <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <Success/>
                </ProtectedRoute>
              }/>
          </Routes>
          <Footer/>
      <ToastContainer 
      theme="dark"
  position="bottom-right"
  autoClose={1600}
  hideProgressBar={true} // Removes the timer bar
  closeButton={false}    // Removes the 'X' for a cleaner look
  toastClassName={() => 
    "relative flex p-1 min-h-10 rounded-2xl justify-between overflow-hidden cursor-pointer bg-white shadow-xl"
  }
/>
        </div>
    </Router>
  )
}
export default App;

