import React from 'react';
import { Box } from '@mui/material';

// import './Friendship.css';
import Navbar from '../../components/NavBar';
import FriendshipComponent from '../../components/AllFriendship'

function FriendshipContainer() {
    const itemList = ['Suggestions', 'Requests', 'Friends'];
	const currentRoute = window.location.pathname;
  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Navbar currentRoute={ currentRoute }/>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <FriendshipComponent items= {itemList}/>
        </Box>
      </Box>
    </>
  )
}

export default FriendshipContainer
 