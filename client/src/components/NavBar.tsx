import React, { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home'
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import TelegramIcon from '@mui/icons-material/Telegram';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

import "./Navbar.css";
import { useAppSelector, useAppDispatch } from '../utils/redux-hooks';
import { selectCurrentUser, FetchUser, selectCurrentAvatar, selectCurrentAccessToken, selectCurrentRefreshToken } from '../redux-features/auth/authSlice';
// import ForumIcon from '@material-ui/icons/Forum';
// import LogoutIcon from '@mui/icons-material/Logout';
// import { useDispatch } from 'react-redux';
import { useLogOutMutation } from '../app/api/authApiSlice';
import { io } from 'socket.io-client';
/* *** Internal imports *** */ 
import api from '../utils/Axios-config/Axios';
import Cookies from 'js-cookie';

interface NavbarProps {
    currentRoute: string;
  }

const Navbar : React.FC<NavbarProps> = ({ currentRoute }) => {
    const dispatch = useAppDispatch();
    const nickname = useAppSelector(selectCurrentUser)
    const navigate = useNavigate();
    const [logout] = useLogOutMutation();
    const access_token = useAppSelector(selectCurrentAccessToken)
    const refresh_token = useAppSelector(selectCurrentRefreshToken)
    const user = useAppSelector(selectCurrentUser);


    const logOut = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      await logout({user, access_token, refresh_token});
      if (Cookies.get('Authcookie') !== undefined)
        Cookies.remove('Authcookie');
      navigate("/sign");
    }

    useEffect(()=> {
        dispatch(FetchUser());
    }, [])
    const srcAvatar = useAppSelector(selectCurrentAvatar);
    console.log('lavatarrrr ', srcAvatar);
    const chat = () => {

        navigate('/chat')
    }
    const friendship = () => {

        navigate('/friendship')
    }
    let componentToRender;
    if (currentRoute === '/welcome') {
        componentToRender = (
        <>
        <div className='navbar__header__middle'>
            <div className="navbar__header__options navbar__header__options--active">
                <HomeIcon fontSize="large"/>
            </div>
            <div className="navbar__header__options">
                <PersonAddIcon fontSize="large" onClick={friendship}/>
            </div>
            <img src="" alt=""/>
            <div className = 'navbar__header__input'>
                <TelegramIcon onClick={chat}/>
            </div>
        </div>

    {/* ********************************** */}
        <div className="navbar__header__right">
            <Avatar src={srcAvatar} sx={{
                margin: '5px',
                width: 50,
                height: 50,
            }}/>
            <h4> {nickname} </h4>
            <IconButton onClick={logOut}>
                <LogoutIcon fontSize='medium'/>
            </IconButton>  
        </div>
    </>
)
    }
    else {
        componentToRender = (
            <>
                <div className="navbar__header__right__options">
                    <Avatar src={srcAvatar} sx={{
                        margin: '5px',
                        width: 50,
                        height: 50,
                    }}/>
                    <h4> {nickname} </h4>
                    <IconButton onClick={logOut}>
                        <LogoutIcon fontSize='medium' />
                    </IconButton>  
                </div>
            </>
        )
    }
    return <div className='navbar'> { componentToRender} </div>
}

export default Navbar;