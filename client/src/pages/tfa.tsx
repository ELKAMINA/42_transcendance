import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector} from '../utils/redux-hooks';

import './home.css';
import api from '../utils/Axios-config/Axios'
import { selectCurrentAccessToken, selectCurrentUser, setSignCredentials, setTokens } from '../redux-features/auth/authSlice';
import { useTfaAuthenticateMutation } from '../app/api/authApiSlice';
import axios from 'axios';
import { Box } from '@mui/material';

function Tfa () {
    let nickname: string;
    const dispatch = useAppDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    nickname = useAppSelector(selectCurrentUser)
    const param = searchParams.get('param1')
    if (param && nickname === '')
      nickname = param
    const navigate = useNavigate()
    let [TfaCode, setTfaCode] = React.useState('')

    const handleSubmit = async () => {
        try {
          await api.post('http://localhost:4001/auth/2fa/authenticate', {TfaCode, nickname})
          .then((res) => {
            dispatch(setSignCredentials({...res.data, nickname}))
            navigate('/welcome')
          })
          .catch((e)=> {navigate('/sign')})		  
        }
        catch{
          console.log('this is shit')
        }
      }
    return (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 70%)',
          justifyContent: 'space-evenly'
        }}>
          <h1> Enter your TFA code to Sign in </h1>
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
      </Box>
    )
}

export default Tfa;