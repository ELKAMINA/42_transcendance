import { useEffect } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useAppSelector, useAppDispatch } from '../utils/redux-hooks'; // These typed hooks are different from the authSlice, because, as we're using redux thunks inside slices, we need specific typing for typescript
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/NavBar';
import { socket, connectSocket } from '../socket'
import { FriendSuggestion } from '../components/FriendRequests';
import { selectSuggestions, selectFrRequests } from '../redux-features/friendship/friendshipSlice';
import { FetchAllUsers, FetchAllFriendRequests } from '../redux-features/friendship/friendshipSlice';


function Suggestions () {
  const currentRoute = window.location.pathname;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const getFriends = () => {
    navigate('/friendRequests');
  }
  // const currUser = useSelector(selectCurrentUser)
  // const avatar = useSelector(selectCurrentAvatar)
  // const accessToken = useSelector(selectCurrentAccessToken)

  useEffect(() => {
    connectSocket('friendship');
    dispatch(FetchAllUsers());
    return () => {
      console.log('Unregistering events...');
      // socket.off('onMessage');
    }
  }, []);
  const suggestions = useAppSelector(selectSuggestions)
  console.log("la friendshipense ", suggestions)
  
  const content = (
    <div>
      <Navbar currentRoute={ currentRoute }/>
      <h1> Get all user from Database </h1>
      <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='100vw' minHeight='20vh' alignItems='center' justifyContent='center' >
        {suggestions.map((sugg: any) => 
          <FriendSuggestion id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="request"/>)}
      </Stack>
      <Button onClick={getFriends}>
        See my friend requests
      </Button>
      
      
    </div>
  )
  return content;
};

function Requests () {
  const currentRoute = window.location.pathname;
  console.log("currentRoute", currentRoute);
  const dispatch = useAppDispatch();
  // const currUser = useSelector(selectCurrentUser)
  // const avatar = useSelector(selectCurrentAvatar)
  // const accessToken = useSelector(selectCurrentAccessToken)

  useEffect(() => {
    // dispatch(getSocket({socket}))
    // socket.emit('friendReq', {msg: 'hello world'} );
    console.log('testeeuuuug');
    // connectSocket('friendship');
    dispatch(FetchAllFriendRequests());
    socket.on('acceptedFriend', (data: any) => {
      // Il faut trier pour ne laisser que les amis dont le statut de la friendRequest est tjrs en cours
      console.log('data reçue du serveur', data.FriendRequestReceived);
    })
    return () => {
      console.log('Unregistering events...');
      // socket.off('onMessage');
    }
  }, []);
  // socket = useAppSelector(selectSocket)
  const friendsRequests = useAppSelector(selectFrRequests);
  console.log('requestssss', friendsRequests);
  // FriendReqSocket.on('friendRequestFromServer', (dataServer) => {
  //   console.log(dataServer);
  // })
  
  const content = (
    <div>
      <Navbar currentRoute={ currentRoute }/>
      <h1> Get all user from Database </h1>
      <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='100vw' minHeight='20vh' alignItems='center' justifyContent='center' >
        {friendsRequests.map((sugg: any) => 
          <FriendSuggestion id={sugg.user_id} login={sugg.senderId} avatar={sugg.avatar} type="requestReception"/>)}
      </Stack>
      
      
    </div>
  )
  return content;
}

 

export { Suggestions, Requests};