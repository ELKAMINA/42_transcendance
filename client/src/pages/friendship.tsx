import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useAppSelector, useAppDispatch } from '../utils/redux-hooks'; // These typed hooks are different from the authSlice, because, as we're using redux thunks inside slices, we need specific typing for typescript

import Navbar from '../components/NavBar';
import { useSelector } from 'react-redux';
import { Login } from '@mui/icons-material';
import { FriendSuggestion } from '../components/FriendRequests';
import { selectCurrentAccessToken, selectCurrentAvatar, selectCurrentUser } from '../redux-features/auth/authSlice';
import { FetchAllUsers } from '../redux-features/friendship/friendshipSlice';
import { selectSuggestions } from '../redux-features/friendship/friendshipSlice';
import {socket,connectSocket} from '../socket'

// export const FriendReqSocket = io('http://localhost:4001/friendship', {
//   withCredentials: true,
//   transports: ['websocket'],
//   upgrade: false,
// })

// connectSocket('friendship');

function Friendship () {
  const currentRoute = window.location.pathname;
  const dispatch = useAppDispatch();
  // const currUser = useSelector(selectCurrentUser)
  // const avatar = useSelector(selectCurrentAvatar)
  // const accessToken = useSelector(selectCurrentAccessToken)

  useEffect(() => {
    // dispatch(getSocket({socket}))
    // socket.emit('friendReq', {msg: 'hello world'} );
    connectSocket('friendship');
    dispatch(FetchAllUsers());
    return () => {
      console.log('Unregistering events...');
      // socket.off('onMessage');
    }
  }, []);
  // socket = useAppSelector(selectSocket)
  const suggestions = useAppSelector(selectSuggestions)
  // FriendReqSocket.on('friendRequestFromServer', (dataServer) => {
  //   console.log(dataServer);
  // })
  
  const content = (
    <div>
      <Navbar currentRoute={ currentRoute }/>
      <h1> Get all user from Database </h1>
      <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='100vw' minHeight='20vh' alignItems='center' justifyContent='center' >
        {suggestions.map((sugg: any) => 
          <FriendSuggestion id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="request"/>)}
      </Stack>
      
      
    </div>
  )
  return content;
}

export default Friendship;