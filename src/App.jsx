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

// const Home = () => <div><h2>Welcome to VOID ENERGY</h2><p>Home of pure signal</p></div>;
// const Login = () => <div><h2>Login Page</h2><p>enter FLOWSTATE</p></div>;
// const Register = () => <div><h2>Register Page</h2><p>"hisToric!"</p></div>;

function App(){
  return(
    <Router>
      <Navbar/>
        
        <div style={{padding: '2rem'}}>
          {/* nav links */}
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
              {/*dynamic route|*/}
              <Route path="/product/:id" element={<ProductDetail/>}/>
              <Route path="/cart" element={<Cart/>}/>
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
        </div>
    </Router>
  )
}
export default App;

