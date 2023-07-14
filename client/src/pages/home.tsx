/* *** External imports *** */ 
import * as React from 'react';
import Popup from 'reactjs-popup';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
// import { useDispatch } from 'react-redux';
import { useAppSelector } from '../utils/redux-hooks.tsx';
/* *** Internal imports *** */ 
import './home.css';
import Navbar from '../components/NavBar.tsx';
import { selectCurrentUser, selectCurrentAccessToken, selectCurrentRefreshToken } from '../redux-features/auth/authSlice.tsx';

// export const HomeSock = io('http://localhost:4001/home');

function HomePage() {
  const user = useAppSelector(selectCurrentUser);
  const access_token = useAppSelector(selectCurrentAccessToken)
  const refresh_token = useAppSelector(selectCurrentRefreshToken)
  const welcome = user ? `Welcome ${user}` : 'Welcome buddy'
  const a_tokenAbbr = `${access_token.slice(0, 10)}...`
  const r_tokenAbbr = `${refresh_token.slice(0,10)}...`

  const currentRoute = window.location.pathname;

  const content = (
    <div className='home'>

      <div className='home__header'>
        <Navbar currentRoute={ currentRoute }/>
      </div>

      <div className='home__middle'>
        <h1>{ welcome }</h1>
      </div>

      <div className='home__bottom'>
        <p>You are logged in and your token is : {a_tokenAbbr} <br/> && {r_tokenAbbr} <br/></p>
      </div>

    </div>
  )
  return content
}

export default HomePage;