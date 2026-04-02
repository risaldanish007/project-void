import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
    const {isAuthenticated} = useSelector((state)=>state.auth)
    const location = useLocation()

    console.log("is user allowed in", isAuthenticated)

    if(!isAuthenticated){
        // return<Navigate to="/login" replace/>;
        return <Outlet/>;
    }
            return isAuthenticated ? <Outlet/> : <Navigate to="/login" state={{from: location}} replace />;

};

export default ProtectedRoute;