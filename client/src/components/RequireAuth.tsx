import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux";
import { selectCurrentAccessToken } from "../features/auth/authSlice";

// useSelector : Allows you to extract data from the Redux store state, using a selector function.
// This requireAuth makes us check if we're logged in (if any token exists) 

const RequireAuth = () => {
  const a_token = useSelector(selectCurrentAccessToken)
  const location = useLocation()
  return (
    a_token
     ? <Outlet />
     : <Navigate to ="sign" state={{ from: location}} replace/>
  )
}

export default RequireAuth;
