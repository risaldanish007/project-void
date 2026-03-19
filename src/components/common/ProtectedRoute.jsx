import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useSelector((state)=>state.auth)
    const location = useLocation()

    console.log("is user allowed in", isAuthenticated)

    if(!isAuthenticated){
        // return<Navigate to="/login" replace/>;
        return<Navigate to="/login" state={{from: location}} replace />;
    }
    return children
}

export default ProtectedRoute;