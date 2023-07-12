import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import { selectCurrentUser, selectCurrentAvatar, selectCurrentAccessToken, selectCurrentRefreshToken } from '../redux-features/auth/authSlice';
// import ForumIcon from '@material-ui/icons/Forum';
// import LogoutIcon from '@mui/icons-material/Logout';
// import { useDispatch } from 'react-redux';
import { useLogOutMutation } from '../app/api/authApiSlice';
import { io } from 'socket.io-client';
/* *** Internal imports *** */ 
import api from '../utils/Axios-config/Axios';
import Cookies from 'js-cookie';
import e from 'express';

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

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const getMyProfile = async () => {
        await api
		.get('http://localhost:4001/user/userprofile', {
				params: {
						ProfileName: nickname,
					}
				})
		.then((res) => {
			const params = new URLSearchParams(res.data).toString()
			navigate(`/userprofile?data=${params}`)})
		.catch((e) => {
			console.log('ERROR from request with params ', e)
		})
    }

    const logOut = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      await logout({nickname, access_token, refresh_token});
      if (Cookies.get('Authcookie') !== undefined)
        Cookies.remove('Authcookie');
      navigate("/sign");
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate('/settings')
    }
    const home = async () => {
        navigate('/welcome')
    }
    const srcAvatar = useAppSelector(selectCurrentAvatar);
    const chat = () => {

        navigate('/chat')
    }
    const friendship = () => {

        navigate('/friendship')
    }
    let componentToRender;
    // if (currentRoute === '/welcome' ) {
        componentToRender = (
        <>
        <div className='navbar__header__middle'>
            <div className="navbar__header__options navbar__header__options--active">
                <HomeIcon fontSize="large" onClick={home}/>
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
            <Button
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{color: 'white'}}
            >
                {nickname}
            </Button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{
                    zIndex:0,
                }}
            >
                <MenuItem onClick={getMyProfile}>Profile</MenuItem>
                <MenuItem component="a" href="/" onClick={handleSubmit}>Settings</MenuItem>
                <MenuItem component="a" href="/" onClick={logOut}>Logout</MenuItem>
            </Menu>            
            <IconButton component="a" href="/" onClick={logOut}>
                <LogoutIcon fontSize='medium'/>
            </IconButton>  
        </div>
    </>
)
    // }
    // else {
    //     componentToRender = (
    //         <>
    //             <div className="navbar__header__right__options">
    //                 <Avatar src={srcAvatar} sx={{
    //                     margin: '5px',
    //                     width: 50,
    //                     height: 50,
    //                 }}/>
    //                 <Button
    //                     id="demo-positioned-button"
    //                     aria-controls={open ? 'demo-positioned-menu' : undefined}
    //                     aria-haspopup="true"
    //                     aria-expanded={open ? 'true' : undefined}
    //                     onClick={handleClick}
    //                 >
    //                     {nickname}
    //                 </Button>
    //                 <Menu
    //                     id="demo-positioned-menu"
    //                     aria-labelledby="demo-positioned-button"
    //                     anchorEl={anchorEl}
    //                     open={open}
    //                     onClose={handleClose}
    //                     anchorOrigin={{
    //                     vertical: 'top',
    //                     horizontal: 'left',
    //                     }}
    //                     transformOrigin={{
    //                     vertical: 'top',
    //                     horizontal: 'left',
    //                     }}
    //                 >
    //                 <MenuItem onClick={getMyProfile}>Profile</MenuItem>
    //                 <MenuItem component="a" href="/" onClick={handleSubmit}>Settings</MenuItem>
    //                 <MenuItem component="a" href="/" onClick={logOut}>Logout</MenuItem>
    //                 </Menu>
    //                 <IconButton component="a" href="/" onClick={logOut}>
    //                     <LogoutIcon fontSize='medium' />
    //                 </IconButton>  
    //             </div>
    //         </>
    //     )
    return <div className='navbar'> { componentToRender} </div>
}






export default Navbar;