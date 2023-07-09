/* *** External imports *** */ 
import * as React from 'react';
import Popup from 'reactjs-popup';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
// import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom';
import { useLogOutMutation } from '../app/api/authApiSlice';
import { io } from 'socket.io-client';
/* *** Internal imports *** */ 
import './home.css';
import api from "../utils/Axios-config/Axios.tsx";
import Navbar from '../components/NavBar.tsx';
import { selectCurrentUser, selectCurrentAccessToken, selectCurrentRefreshToken } from '../redux-features/auth/authSlice.tsx';

// export const HomeSock = io('http://localhost:4001/home');

function HomePage() {
  const user = useSelector(selectCurrentUser);
  let [qrcode, setQrcode] = React.useState('')
  let [TfaCode, setTfaCode] = React.useState('')
  const access_token = useSelector(selectCurrentAccessToken)
  const refresh_token = useSelector(selectCurrentRefreshToken)
  const navigate = useNavigate();
  const welcome = user ? `Welcome ${user}` : 'Welcome buddy'
  const a_tokenAbbr = `${access_token.slice(0, 10)}...`
  const r_tokenAbbr = `${refresh_token.slice(0,10)}...`

  const tfa = async () => {
    await api
    .post("http://0.0.0.0:4001/auth/2fa/generate")
    .then((res) => {setQrcode(res.data);})
    .catch((e) => {console.log("error ", e)});
  }
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault(); // faire pareil que ci-dessus
    await api
    .post("http://0.0.0.0:4001/auth/2fa/turn-on", {TfaCode})
    .then((res) => {navigate('/tfa');})
    .catch((e) => {console.log("error ", e)});
  }
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
        <Button className="mui-btn" type="submit" variant="contained" onClick={tfa} > Tfa </Button>
        <Popup 
          trigger={<div>TFA</div>}
          position="right center" 
          on="click"
          closeOnDocumentClick
          modal
          nested    
        >
        </Popup>
        <img
          src={qrcode}
          alt=""
          className='omg'
        />
        <form id='form'>
        <input
          type="text"
          onChange={(e)=> setTfaCode(e.target.value)}
          placeholder="Tfa-Code"
          value={TfaCode}
          required
          />
        </form>
        <Button className="mui-btn" type="submit" variant="contained" onClick={handleSubmit}>Send code</Button>
      </div>

    </div>
  )
  return content
}

export default HomePage;