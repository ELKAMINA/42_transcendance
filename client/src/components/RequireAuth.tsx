import { useAppSelector } from "../utils/redux-hooks";
import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useEffect } from "react";
import { selectCurrentAccessToken, selectCurrentUser, selectCurrentRefreshToken } from "../redux-features/auth/authSlice";
import { useLogOutMutation } from '../app/api/authApiSlice';

// useSelector : Allows you to extract data from the Redux store state, using a selector function.
// This requireAuth makes us check if we're logged in (if any token exists) 

const RequireAuth = () => {
  const a_token = useAppSelector(selectCurrentAccessToken)
  const location = useLocation()
  const nickName = useAppSelector(selectCurrentUser)
  const rt = useAppSelector(selectCurrentRefreshToken)
  const at = useAppSelector(selectCurrentAccessToken)
//   const [logout] = useLogOutMutation();

//   useEffect(() => { // this was for changing the status of the player if he quitsthe page suddenly but the problem is that it is trigerred even if the user refreshes the page so it triggers the logout function and we dont want this. We have to find a new solution
// 	const handleUnload = async (e: BeforeUnloadEvent) => {
// 	  e.preventDefault();
// 	  console.log(" je rentre ici quand le mec quitte")
// 	  await logout({nickName, at, rt});
// 	  // you can make API calls or cleanup operations here
// 	  // ...
// 	};
  
// 	window.addEventListener('beforeunload', handleUnload);
  
// 	return () => {
// 	  window.removeEventListener('beforeunload', handleUnload);
// 	};
//   }, []);
  return (
    a_token
     ? <Outlet />
     : <Navigate to ="sign" state={{ from: location}} replace/>
  )
}

export default RequireAuth;
