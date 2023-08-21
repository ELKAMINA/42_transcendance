import { useAppSelector } from "../utils/redux-hooks";
import { useLocation, Navigate, Outlet } from "react-router-dom"
import { selectCurrentAccessToken } from "../redux-features/auth/authSlice";


// useSelector : Allows you to extract data from the Redux store state, using a selector function.
// This requireAuth makes us check if we're logged in (if any token exists) 

const RequireAuth = () => {
  const a_token = useAppSelector(selectCurrentAccessToken)
  const location = useLocation()

  // console.log('Acces_token ', a_token)
  // console.log('dou je viens ', location.pathname)

  return (
    a_token
     ? <Outlet />
     : <Navigate to ="sign" state={{ from: location}} replace/>
  )
}

export default RequireAuth;
