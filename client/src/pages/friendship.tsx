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
import { updateAllRequests, updateAllFriends, updateBlockedFriends, updateSocketId, updateAllUsers } from '../redux-features/friendship/friendshipSlice';
import { selectSuggestions, selectFrRequests, selectFriends, selectSocketId } from '../redux-features/friendship/friendshipSlice';
import { FetchAllUsers, FetchAllFriendRequests, FetchAllFriends, FetchAllBlockedFriends } from '../redux-features/friendship/friendshipSlice';
import { selectCurrentAccessToken, setOnlyTokens } from '../redux-features/auth/authSlice';



export const socket = io('http://localhost:4001/friendship', {
  withCredentials: true,
  transports: ['websocket'],
  upgrade: false,
  autoConnect: false,
  // reconnection: true,
})

function Suggestions () {
  const socketId = useAppSelector(selectSocketId);
  const currentRoute = window.location.pathname;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let suggestions = useAppSelector(selectSuggestions);
  const getFriendsRequests = () => {
      navigate('/friendRequests');
    }
  const getAllMyFriends = () => {
      navigate('/friends');
    }
      useEffect(() => {
        socket.connect()
        socket.on('connect', () => {
          // console.log("la socket id ", socket.id);
          // dispatch(updateSocketId(socket.id));
          dispatch(FetchAllUsers());
        })
        return () => {  // cleanUp function when component unmount
          console.log('Suggestions - Unregistering events...');
          // // socket.disconnect();
          // dispatch(updateSocketId(''));
          // socket.off('denyFriend');
          // socket.off('friendAdded')
          // socket.off('connect');
        }
      }, [])
      useEffect(() => {
          socket.on('newUserConnected', () => {
            socket.emit('realTimeUsers');
            socket.on('realTimeUsers', (allUsers) => {
              dispatch(FetchAllUsers());
            })
          })
          socket.on('newCookie', (data) => {
            dispatch(setOnlyTokens({...data}));
            const serializeData = JSON.stringify(data);
            Cookies.set('Authcookie', serializeData, { path: '/' });
          })
          socket.on('friendAdded', () => {
            dispatch(FetchAllUsers())
          })
          socket.on('denyFriend', () => {
            dispatch(FetchAllUsers())
          })
          return () => {  // cleanUp function when component unmount
            console.log('Suggestions - Unregistering events...');
          }
        }, [dispatch]);
        suggestions = useAppSelector(selectSuggestions)
        
        const content = (
    <div>
      <Navbar currentRoute={ currentRoute }/>
      <h1> Get all user from Database </h1>
      <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='100vw' minHeight='20vh' alignItems='center' justifyContent='center' >
        {suggestions.map((sugg: any) => 
          <FriendSuggestion key={sugg.user_id} id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="request"/>)}
      </Stack>
      <Button onClick={getFriendsRequests}>
        See my friend requests
      </Button>
      <Button onClick={getAllMyFriends}>
        See my friends
      </Button>
    </div>
  )
  return content;
};

// Suggestions -------------------

function Requests () {
  const currentRoute = window.location.pathname;
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      // console.log("la socket id ", socket.id);
      // dispatch(updateSocketId(socket.id));
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
    // socket?.on('blockFriend', (data: any) => {
    //   // Il faut trier pour ne laisser que les amis dont le statut de la friendRequest est tjrs en cours
    //   // console.log("les requests restantes", data.FriendRequestReceived);
    //  dispatch(updateBlockedFriends(data.blockedFriends))
    // })
    socket?.on('denyFriend', () => {
      // Il faut trier pour ne laisser que les amis dont le statut de la friendRequest est tjrs en cours
      // console.log("les requests restantes", data.FriendRequestReceived);
      dispatch(FetchAllFriendRequests());
    })
    return () => {
      // console.log('Unregistering events...');
      dispatch(updateSocketId(''));
      // socket.disconnect();
      // socket.off('onMessage');
    }
  }, [dispatch]);
  // socket = useAppSelector(selectSocket)
  const friendsRequests = useAppSelector(selectFrRequests);
  // console.log('requestssss', friendsRequests);
  // FriendReqSocket.on('friendRequestFromServer', (dataServer) => {
  //   console.log(dataServer);
  // })
  
  const content = (
    <div>
      <Navbar currentRoute={ currentRoute }/>
      <h1> Get all user from Database </h1>
      {(friendsRequests.length === 0) && <h2 style={{'color': 'yellow', 'fontSize': '13px'}} >No one wanna be your friend </h2> }
      {(friendsRequests.length > 0) && 
      <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='100vw' minHeight='20vh' alignItems='center' justifyContent='center' >
        {friendsRequests.map((sugg: any) => 
          <FriendSuggestion id={sugg.user_id} login={sugg.senderId} avatar={sugg.avatar} type="requestReception"/>)}
      </Stack>
      }
      
      
    </div>
  )
  return content;
}

function Friends () {
  const currentRoute = window.location.pathname;
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      // console.log("la socket id ", socket.id);
      // dispatch(updateSocketId(socket.id));
      dispatch(FetchAllFriends());
    })
    dispatch(FetchAllFriends);
  }, [])
  useEffect(() => {
    socket?.on('friendBlocked', (data: any) => {

    })
    socket?.on('acceptedFriend', (data: any) => {
      dispatch(FetchAllFriends())
     })
    return () => {
      console.log('From friends - Unregistering events...');
      // Disconnect sockets ?
    }
  }, [dispatch]);
  const friends = useAppSelector(selectFriends);
  
  const content = (
    <div>
      <Navbar currentRoute={ currentRoute }/>
      <h1> Get all user from Database </h1>
      <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='100vw' minHeight='20vh' alignItems='center' justifyContent='center' >
        {friends.map((sugg: any) => 
          <FriendSuggestion id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="myFriends"/>)}
      </Stack>
    </div>
  )
  return content;
}

export { Suggestions, Requests, Friends };