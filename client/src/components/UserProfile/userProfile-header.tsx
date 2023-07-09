import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useState } from 'react';

interface myProps {
    name: string | null,
    status: string | null,
    friendship: {
      isMyfriend: boolean,
      myBlockedFriend: boolean,
      thoseWhoBlockedMe: boolean
    }
    // friendship: boolean,
}



function UserProfileHeader(props: myProps) {
  const [color, setColorBadge] = useState('red');
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: color,
      color: color,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));
  React.useEffect(() => {
    if (props.status === 'Offline')
      setColorBadge('red');
    else if (props.status === 'Online')
      setColorBadge('green');
    else
      setColorBadge('orange');
  }, [props.status]);
  return (
    <Box textAlign='center' display="flex" flexDirection="row" alignItems="center" p={2} justifyContent="space-around" 
    sx={{
      width: '90vw',
      height: '20vh',
      backgroundColor: '#20B2AA',
      borderRadius:'10px',
    }}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Avatar src='' alt="User Avatar"
        sx={{
          width: '150px',
          height: '150px',
          marginRight:'5px',
        }}/>
        <Typography variant="h3">{props.name}</Typography>
      </Box>
        <Box ml={2} display="flex" flexDirection='row' justifyContent='space-between' flexWrap='wrap'>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
          <Typography variant="body1" color="textSecondary">
              {props.status}
          </Typography>
          </StyledBadge>
        </Box>
        <Box ml={2} display="flex" flexDirection='row' justifyContent='space-between' flexWrap='wrap'>
        {props.friendship.myBlockedFriend && <div className='userprof-header'>Blocked Friend</div> }
        {props.friendship.thoseWhoBlockedMe && <div className='userprof-header'>He Blocked Friend</div> }
        {props.friendship.isMyfriend && <div className='userprof-header'>Friend</div> }
        {!props.friendship.isMyfriend && !props.friendship.thoseWhoBlockedMe && !props.friendship.myBlockedFriend && <div className='userprof-header'>Not Friends</div>}
        </Box> 
  </Box>
  )
}

export default UserProfileHeader;





// const pages = ['Products', 'Pricing', 'Blog'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

// function ResponsiveAppBar() {
//   const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
//   const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

//   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElNav(event.currentTarget);
//   };
//   const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };
// export default ResponsiveAppBar;
