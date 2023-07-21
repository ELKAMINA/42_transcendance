/* *** External imports *** */ 
import * as React from 'react';
import { Box, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
// import { useDispatch } from 'react-redux';
import { useAppSelector } from '../utils/redux-hooks.tsx';
/* *** Internal imports *** */ 
import './home.css';
import Navbar from '../components/NavBar.tsx';
import { selectCurrentUser } from '../redux-features/auth/authSlice.tsx';
import { useNavigate } from 'react-router-dom';
import { white } from 'material-ui/styles/colors';

// export const HomeSock = io('http://localhost:4001/home');

function HomePage() {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate()
  // const access_token = useAppSelector(selectCurrentAccessToken)
  // const refresh_token = useAppSelector(selectCurrentRefreshToken)
  const welcome = user ? `Welcome ${user} to PONG GAME` : 'Welcome buddy to PONG GAME'
  // const a_tokenAbbr = `${access_token.slice(0, 10)}...`
  // const r_tokenAbbr = `${refresh_token.slice(0,10)}...`

  const currentRoute = window.location.pathname;

  const play = () => {
    navigate('/game')
  }

  const content = (
    <Box>
      <Stack >
        <Navbar currentRoute={ currentRoute }/>
      </Stack>

      <Stack sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        justifyContent: 'space-evenly'
      }}>
        <h1 className='welcome'>{ welcome }</h1>
        <Button onClick={play} sx={{
            width: '200px',
            height: '50px',
            background: 'linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 97%)',
            color: 'white',
            font: 'bold',
            fontSize:'30px'
          }
        }
        > PLAY </Button>
-      </Stack>

    </Box>
  )
  return content
}

export default HomePage;