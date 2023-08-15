import Cookies from 'js-cookie';
import { Route, Routes } from "react-router-dom";

import "./App.css";
import Tfa from './pages/tfa';
import Game from './pages/game'
import Chat from "./pages/chat";
import HomePage  from "./pages/home";
import Layout from './components/Layout';
import NotFoundPage from './pages/notFound';
import UserProfile from './pages/userProfile';
import AuthContainer from "./containers/Auth/Auth";
import RequireAuth from './components/RequireAuth';
import { useAppDispatch } from './utils/redux-hooks';
import { setTokens } from './redux-features/auth/authSlice';
import SettingsContainer from './containers/Settings/Settings';
import FriendshipContainer from './containers/Friendship/Friendship';



const App = () => {
  const dispatch = useAppDispatch()
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
          <Route path="/" element={<AuthContainer />}/>
          <Route path="/sign" element={<AuthContainer />}/>
          <Route path="/tfa" element={<Tfa />}/>
          <Route element={<RequireAuth />}>
            <Route path="/welcome" element={<HomePage />}/>
            <Route path="/chat" element={<Chat />}/>
            <Route path="/friendship" element={<FriendshipContainer />}/>
            <Route path="/userprofile" element={<UserProfile />}/>
            <Route path="/settings" element={<SettingsContainer />}/>
            <Route path="/game" element={<Game />}/>
          </Route>
          <Route path="*" element={<NotFoundPage/>} />
        </Route>
      </Routes>
    </div>
    )
}


export default App;
