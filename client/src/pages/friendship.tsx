import { useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../utils/redux-hooks'; // These typed hooks are different from the authSlice, because, as we're using redux thunks inside slices, we need specific typing for typescript
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Cookies from 'js-cookie';
// import { ConnectSocket } from '../socket'
import { FriendSuggestion } from '../components/FriendRequests';
import { updateAllRequests, updateAllFriends, updateBlockedFriends, updateAllSuggestions } from '../redux-features/friendship/friendshipSlice';
import { selectSuggestions, selectFrRequests, selectFriends} from '../redux-features/friendship/friendshipSlice';
import { FetchSuggestions, FetchAllFriendRequests, FetchAllFriends } from '../redux-features/friendship/friendshipSlice';
import { selectCurrentAccessToken, setOnlyTokens } from '../redux-features/auth/authSlice';



export const socket = io('http://localhost:4001/friendship', {
  withCredentials: true,
  transports: ['websocket'],
  upgrade: false,
  autoConnect: false,
  // reconnection: true,
})

function Suggestions () {
  const dispatch = useAppDispatch();
  let suggestions = useAppSelector(selectSuggestions);
  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      dispatch(FetchSuggestions());
    })
    return () => {  // cleanUp function when component unmount
    }
  }, [])
  useEffect(() => {
      socket.on('newUserConnected', () => {
        socket.emit('realTimeUsers');
        socket.on('realTimeUsers', (allUsers) => {
          dispatch(FetchSuggestions());
        })
      })
      socket.on('newCookie', (data) => {
        dispatch(setOnlyTokens({...data}));
        const serializeData = JSON.stringify(data);
        Cookies.set('Authcookie', serializeData, { path: '/' });
      })
      socket.on('friendAdded', () => {
        dispatch(FetchSuggestions())
      })
      socket.on('denyFriend', () => {
        dispatch(FetchSuggestions())
      })
      return () => {  // cleanUp function when component unmount
      }
    }, [dispatch]);
      suggestions = useAppSelector(selectSuggestions)
        
        const content = (
    <div>
      {/* <Navbar currentRoute={ currentRoute }/> */}
      <h1> You may know... </h1>
      <Stack spacing={2} sx={{
        // display: 'flex',
        flexDirection: 'row',
        flexWrap:'wrap',
        alignItems:'center',
        justifyContent: 'space-between',
      }} >
        {suggestions.map((sugg: any) => 
          <FriendSuggestion key={sugg.user_id} id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="request"/>)}
      </Stack>
    </div>
  )
  return content;
};

// Suggestions -------------------

function Requests () {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      dispatch(FetchAllFriendRequests());
    })
    dispatch(FetchAllFriendRequests());
  }, [])
  useEffect(() => {
    socket?.on('friendAdded', (data: any) => {
      dispatch(FetchAllFriendRequests());
 
     })
    socket?.on('acceptedFriend', (data: any) => {
     dispatch(FetchAllFriendRequests());

    })
    socket?.on('denyFriend', () => {
      dispatch(FetchAllFriendRequests());
    })
    return () => {
    }
  }, [dispatch]);
  const friendsRequests = useAppSelector(selectFrRequests);

  
  const content = (
    <div>
      {/* <Navbar currentRoute={ currentRoute }/> */}
      {(friendsRequests.length === 0) && <h1>No one wanna be your friend </h1> }
      {(friendsRequests.length > 0) && <h1> They want to be your friend... </h1> &&
      <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='10vw' minHeight='20vh' alignItems='center' justifyContent='center' >
        {friendsRequests.map((sugg: any) => 
          <FriendSuggestion id={sugg.user_id} login={sugg.senderId} avatar={sugg.avatar} type="requestReception"/>)}
      </Stack>
      }
      
      
    </div>
  )
  return content;
}

function Friends () {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      dispatch(FetchAllFriends());
    })
    dispatch(FetchAllFriends());
  }, [])
  useEffect(() => {
    socket?.on('friendBlocked', (data: any) => {

    })
    socket?.on('acceptedFriend', (data: any) => {
      dispatch(FetchAllFriends())
     })
    socket?.on('denyFriend', (data: any) => {
      
     })
    return () => {
    }
  }, [dispatch]);
  const friends = useAppSelector(selectFriends);
  
  const content = (
    <div>
      {/* <Navbar currentRoute={ currentRoute }/> */}
      <h1> Your beloved... </h1>
      <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='10vw' minHeight='20vh' alignItems='center' justifyContent='center' >
        {friends.map((sugg: any) => 
          <FriendSuggestion id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="myFriends"/>)}
      </Stack>
    </div>
  )
  return content;
}

export { Suggestions, Requests, Friends };