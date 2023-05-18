import AuthContainer from "./containers/Auth/Auth";
import { Route, Routes } from "react-router-dom";
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import "./App.css";
import HomePage  from "./pages/home";
import Tfa from './pages/tfa';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setSignCredentials } from './features/auth/authSlice';

const App = () => {
  const dispatch = useDispatch()
  if (Cookies.get('access_token') != null)
  {
    const credentials = {
      access_token : Cookies.get('access_token'),
      refresh_token : Cookies.get('refresh_token'),
      nickname : Cookies.get('User'),
    }
    console.log("ici 3? ");
    dispatch(setSignCredentials({...credentials }))
  }
  return (
    <div className="app">
      <Routes>
        <Route path="/" element= {<Layout/>}>
          <Route path="/sign" element={<AuthContainer />}/>
          <Route element={<RequireAuth />}>
            <Route path="welcome" element={<HomePage />}/>
          </Route>
          <Route path="tfa" element={<Tfa />}/>
        </Route>
      </Routes>
    </div>
    )
}


export default App;
