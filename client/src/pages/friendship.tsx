import { useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { io } from 'socket.io-client';
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
  // const getFriendsRequests = () => {
    //   navigate('/friendRequests');
    // }
    // const getAllMyFriends = () => {
      //   navigate('/friends');
      // }
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
        // if (socketId === undefined || socketId === '')
        // {
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
      {/* <Button onClick={getFriendsRequests}>
        See my friend requests
      </Button>
      <Button onClick={getAllMyFriends}>
        See my friends
      </Button> */}
    </div>
  )
  return content;
};

// Suggestions -------------------

// function Requests () {
//   const currentRoute = window.location.pathname;
//   const dispatch = useAppDispatch();
//   // console.log("currentRoute", currentRoute);
//   // const access_token = useAppSelector(selectCurrentAccessToken);
//   const socketId = useAppSelector(selectSocketId);
//   // const currUser = useSelector(selectCurrentUser)
//   // const avatar = useSelector(selectCurrentAvatar)
//   // const accessToken = useSelector(selectCurrentAccessToken)

//   useEffect(() => {
//     if (socketId === undefined || socketId === '')
//     {
//       socket.connect()
//       socket.on('connect', () => {
//         dispatch(updateSocketId(socket.id));
//       })
//     }
//     dispatch(FetchAllFriendRequests());
//     dispatch(FetchAllBlockedFriends());
//     socket?.on('acceptedFriend', (data: any) => {
//       // Il faut trier pour ne laisser que les amis dont le statut de la friendRequest est tjrs en cours
//       // console.log("les requests restantes", data.FriendRequestReceived);
//      dispatch(updateAllRequests(data.FriendRequestReceived));
//      dispatch(updateAllFriends(data.friends))

//     })
//     socket?.on('blockFriend', (data: any) => {
//       // Il faut trier pour ne laisser que les amis dont le statut de la friendRequest est tjrs en cours
//       // console.log("les requests restantes", data.FriendRequestReceived);
//      dispatch(updateBlockedFriends(data.blockedFriends))
//     })
//     socket?.on('denyFriend', () => {
//       // Il faut trier pour ne laisser que les amis dont le statut de la friendRequest est tjrs en cours
//       // console.log("les requests restantes", data.FriendRequestReceived);
//       dispatch(FetchAllFriendRequests());
//     })
//     return () => {
//       // console.log('Unregistering events...');
//       dispatch(updateSocketId(''));
//       // socket.disconnect();
//       // socket.off('onMessage');
//     }
//   }, [socketId]);
//   // socket = useAppSelector(selectSocket)
//   const friendsRequests = useAppSelector(selectFrRequests);
//   // console.log('requestssss', friendsRequests);
//   // FriendReqSocket.on('friendRequestFromServer', (dataServer) => {
//   //   console.log(dataServer);
//   // })
  
//   const content = (
//     <div>
//       <Navbar currentRoute={ currentRoute }/>
//       <h1> Get all user from Database </h1>
//       {(friendsRequests.length === 0) && <h2 style={{'color': 'yellow', 'fontSize': '13px'}} >No one wanna be your friend </h2> }
//       {(friendsRequests.length > 0) && 
//       <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='100vw' minHeight='20vh' alignItems='center' justifyContent='center' >
//         {friendsRequests.map((sugg: any) => 
//           <FriendSuggestion id={sugg.user_id} login={sugg.senderId} avatar={sugg.avatar} type="requestReception"/>)}
//       </Stack>
//       }
      
      
//     </div>
//   )
//   return content;
// }

// function Friends () {
//   const currentRoute = window.location.pathname;
//   const access_token = useAppSelector(selectCurrentAccessToken);
//   // console.log("currentRoute", currentRoute);
//   const socketId = useAppSelector(selectSocketId);
//   const dispatch = useAppDispatch();
//   // const currUser = useSelector(selectCurrentUser)
//   // const avatar = useSelector(selectCurrentAvatar)
//   // const accessToken = useSelector(selectCurrentAccessToken)

//   useEffect(() => {
//     if (socketId === undefined || socketId === '')
//     {
//       socket.connect()
//       socket.on('connect', () => {
//         // console.log('socket connected');
//         // console.log('socker id ', socket.id);
//         // localStorage.setItem('socketId', socket.id);
//         dispatch(updateSocketId(socket.id));
//       })
//     }
//     dispatch(FetchAllFriends());
//     return () => {
//       // console.log('Unregistering events...');
//       dispatch(updateSocketId(socket.id));
//       // socket.off('onMessage');
//       // socket.disconnect();
//     }
//   }, [socketId]);
//   // socket = useAppSelector(selectSocket)
//   const friends = useAppSelector(selectFriends);
//   // console.log('requestssss', friendsRequests);
//   // FriendReqSocket.on('friendRequestFromServer', (dataServer) => {
//   //   console.log(dataServer);
//   // })
  
//   const content = (
//     <div>
//       <Navbar currentRoute={ currentRoute }/>
//       <h1> Get all user from Database </h1>
//       <Stack spacing={1}  direction='row' flexWrap='wrap' flexShrink='0' minWidth='100vw' minHeight='20vh' alignItems='center' justifyContent='center' >
//         {friends.map((sugg: any) => 
//           <FriendSuggestion id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="myFriends"/>)}
//       </Stack>
      
      
//     </div>
//   )
//   return content;
// }

 

// export { Suggestions, Requests, Friends};
export { Suggestions };