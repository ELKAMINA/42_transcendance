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
// import { Suggestions, Requests, Friends } from './pages/friendship';
import UserProfile from './pages/userProfile';
import SettingsContainer from './containers/Settings/Settings';
import { setTokens } from './redux-features/auth/authSlice';
import FriendshipContainer from './containers/Friendship/Friendship';

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
            <Route path="/friendship" element={<FriendshipContainer />}/>
            <Route path="/userprofile" element={<UserProfile />}/>
            <Route path="/settings" element={<SettingsContainer />}/>
            <Route path="/tfa" element={<Tfa />}/>
          </Route>
        </Route>
      </Routes>
    </div>
    )
}


export default App;
