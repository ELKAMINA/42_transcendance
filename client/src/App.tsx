import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';

import "./App.css";
import Tfa from './pages/tfa';
import Chat from "./pages/chat";
import HomePage  from "./pages/home";
import Layout from './components/Layout';
import { Route, Routes } from "react-router-dom";
import AuthContainer from "./containers/Auth/Auth";
import RequireAuth from './components/RequireAuth';
import { Suggestions, Requests } from './pages/friendship';
import { setTokens } from './redux-features/auth/authSlice';

const App = () => {
  const dispatch = useDispatch()
  let myCookie: string | undefined = Cookies.get('Authcookie');
  if (myCookie !== undefined)
  {
    let cookieParsed = JSON.parse(myCookie);
    const credentials = {
      access_token : cookieParsed.accessToken,
      refresh_token : cookieParsed.refreshToken,
      nickname : cookieParsed.nickname,
    }
    // console.log(credentials);
    dispatch(setTokens({...credentials }))
  }
  return (
    <div className="app">
      <Routes>
        <Route path="/" element= {<Layout/>}>
          <Route path="/sign" element={<AuthContainer />}/>
          <Route element={<RequireAuth />}>
            <Route path="/welcome" element={<HomePage />}/>
            <Route path="/chat" element={<Chat />}/>
            <Route path="/suggestions" element={<Suggestions />}/>
            <Route path="/friendRequests" element={<Requests />}/>
          </Route>
          <Route path="tfa" element={<Tfa />}/>
        </Route>
      </Routes>
    </div>
    )
}


export default App;
