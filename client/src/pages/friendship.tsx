import { useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../utils/redux-hooks'; // These typed hooks are different from the authSlice, because, as we're using redux thunks inside slices, we need specific typing for typescript
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Cookies from 'js-cookie';
// import { ConnectSocket } from '../socket'
import { FriendSuggestion } from '../components/FriendRequests';
import { updateAllRequests, updateAllFriends, updateBlockedFriends, updateAllSuggestions, setSelectedItem, FetchAllBlockedFriends, selectBlockedFriends } from '../redux-features/friendship/friendshipSlice';
import { selectSuggestions, selectFrRequests, selectFriends} from '../redux-features/friendship/friendshipSlice';
import { FetchSuggestions, FetchAllFriendRequests, FetchAllFriends } from '../redux-features/friendship/friendshipSlice';
import { selectCurrentAccessToken, selectCurrentUser, setOnlyTokens } from '../redux-features/auth/authSlice';
import {socket} from '../components/AllFriendship'



export type userInfo = {
  nickname: string,
  accessToken: string,
  refreshToken: string,
}

function Suggestions () {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector(selectCurrentUser)
  let suggestions = useAppSelector(selectSuggestions);
  useEffect(() => {
    dispatch(FetchSuggestions());
    return () => {
      // socket.disconnect()  // cleanUp function when component unmount
      // dispatch(setSelectedItem(''))
    }
  }, [dispatch])

    socket.on('newUserConnected', (user: string) => {
        if (user !== currUser ){
          dispatch(FetchSuggestions());
        }
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
          <FriendSuggestion key={sugg.user_id} id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="request" bgColor='#AFEEEE'/>)}
      </Stack>
    </div>
  )
  return content;
};

// Suggestions -------------------

function Requests () {
  const dispatch = useAppDispatch();

  useEffect(() => {
      dispatch(FetchAllFriendRequests());
    // dispatch(FetchAllFriendRequests());
    return () => {
      // socket.disconnect()  // cleanUp function when component unmount
      // dispatch(setSelectedItem(''))
    }
  }, [dispatch])

    socket?.on('friendAdded', (data: any) => {
      dispatch(FetchAllFriendRequests());
 
     })
    socket?.on('acceptedFriend', (data: any) => {
     dispatch(FetchAllFriendRequests());

    })
    socket?.on('denyFriend', () => {
      dispatch(FetchAllFriendRequests());
    })
  const friendsRequests = useAppSelector(selectFrRequests);

  
  const content = (
    <div>
      {/* <Navbar currentRoute={ currentRoute }/> */}
      {(friendsRequests.length === 0) && <h1>No one wanna be your friend </h1> }
      {(friendsRequests.length > 0) && <h1> They want to be your friend... </h1> &&
      <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='10vw' minHeight='20vh' alignItems='center' justifyContent='center' >
        {friendsRequests.map((sugg: any) => 
          <FriendSuggestion id={sugg.user_id} login={sugg.senderId} avatar={sugg.SenderAv} type="requestReception" bgColor='#AFEEEE'/>)}
      </Stack>
      }
      
      
    </div>
  )
  return content;
}

function Friends () {
  const dispatch = useAppDispatch();

  useEffect(() => {
      dispatch(FetchAllFriends());
      dispatch(FetchAllBlockedFriends())

    // dispatch(FetchAllFriends());
    return () => {
      socket.disconnect()  // cleanUp function when component unmount
      // dispatch(setSelectedItem(''))
    }
  }, [dispatch])
 
    socket?.on('friendBlocked', (data: any) => {
      dispatch(FetchAllBlockedFriends())
    })
    socket?.on('acceptedFriend', (data: any) => {
      dispatch(FetchAllFriends())
     })
    socket?.on('denyFriend', (data: any) => {
      
     })
  const friends = useAppSelector(selectFriends);
  const blocked = useAppSelector(selectBlockedFriends)
  
//   console.log("frieeeends ", friends);
  const content = (
    <div>
      {/* <Navbar currentRoute={ currentRoute }/> */}
      <h1> Your beloved... </h1>
      <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='10vw' minHeight='20vh' alignItems='center' justifyContent='center' >
        {friends && friends.map((sugg: any) => 
          <FriendSuggestion id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="myFriends" bgColor='#AFEEEE'/>)}
          {blocked && blocked.map((sugg: any) => 
          <FriendSuggestion id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="blockedFriends" bgColor='grey'/>)}
      </Stack>
    </div>
  )
  return content;
}

export { Suggestions, Requests, Friends };