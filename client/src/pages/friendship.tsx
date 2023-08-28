import { useEffect} from 'react';
import {Container, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Grid } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../utils/redux-hooks'; // These typed hooks are different from the authSlice, because, as we're using redux thunks inside slices, we need specific typing for typescript
import Cookies from 'js-cookie';
// import { ConnectSocket } from '../socket'
import { FriendSuggestion } from '../components/FriendRequests';
import { FetchAllBlockedFriends, selectBlockedFriends, setFriendshipError } from '../redux-features/friendship/friendshipSlice';
import { selectSuggestions, selectFrRequests, selectFriends} from '../redux-features/friendship/friendshipSlice';
import { FetchSuggestions, FetchAllFriendRequests, FetchAllFriends } from '../redux-features/friendship/friendshipSlice';
import { selectCurrentUser, setOnlyTokens } from '../redux-features/auth/authSlice';
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
    }
  }, [])

    socket.off('newUserConnected').on('newUserConnected', (user: string) => {
        if (user !== currUser ){
          dispatch(FetchSuggestions());
        }
    })
    // socket.on('newCookie', (data) => {
    //   console.log('[Suggestions] -- je rentre ???', data)
    //   dispatch(setOnlyTokens({...data}));
    //   const serializeData = JSON.stringify(data);
    //   Cookies.set('Authcookie', serializeData, { path: '/' });
    // })

    socket.off('friendAdded').on('friendAdded', (data: any) => {
      if (data != null){
        dispatch(FetchSuggestions())
      }
      else dispatch(setFriendshipError(2))
    })
    socket.off('denyFriend').on('denyFriend', (data:any) => {
      if (data !== null)
        dispatch(FetchSuggestions())
      else 
        dispatch(setFriendshipError(4))
    })
    suggestions = useAppSelector(selectSuggestions)
   return (
       <Container maxWidth="lg" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 8vh)' }}>
         <Typography 
           sx={{
             fontWeight: 'bold',
             fontSize: '30px',
             color: '#07457E',
             textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
             margin: 4,
           }}
         > You may know... </Typography>
         <Grid container spacing={2}>
           {suggestions.map((sugg: any, index) => (
             <Grid item xs={12} sm={6} md={4} key={index}>
               <FriendSuggestion key={index} id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="request" bgColor='#AFEEEE'/>
             </Grid>
           ))}
         </Grid>
       </Container>
     )
  }

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
  }, [])

    socket.off('friendAdded').on('friendAdded', (data: any) => {
      // console.log('oui 3')
     dispatch(FetchAllFriendRequests());
      // else dispatch(setFriendshipError(2))
 
     })

    //  socket.off('newCookie').on('newCookie', (data) => {
    //   console.log('[Requests]---- je rentre ???', data)
    //   dispatch(setOnlyTokens({...data}));
    //   const serializeData = JSON.stringify(data);
    //   Cookies.set('Authcookie', serializeData, { path: '/' });
    // })

    socket.off('acceptedFriend').on('acceptedFriend', (data: any) => {
      if (data != null)
      dispatch(FetchAllFriendRequests());
    else dispatch(setFriendshipError(2))

    })
    socket.off('denyFriend').on('denyFriend', (data: any) => {
      if (data !== null)
        dispatch(FetchAllFriendRequests());
      else dispatch(setFriendshipError(2))

    })
  const friendsRequests = useAppSelector(selectFrRequests);
  
  const content = (
      <Container maxWidth="lg" fixed sx={{
        margin: '1%',
      }}>
        {(friendsRequests.length === 0) && <Typography sx={{
              fontWeight: 'bold',
              fontSize: '30px',
              color: '#07457E',
              textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
              margin: 4,
            }}>No request yet </Typography> }
        {(friendsRequests.length > 0) && <Typography sx={{
              fontWeight: 'bold',
              fontSize: '30px',
              color: '#07457E',
              textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
              margin: 4,
            }}> They want to be your friend... </Typography>}
          <Stack spacing={3} sx={{
            // flexGrow: 1,
            flexDirection: 'row',
            flexWrap:'wrap',
            alignItems:'center',
            justifyContent: 'space-between',
            margin: '10px',
          }} >
            {friendsRequests.map((sugg: any, index) => 
              <FriendSuggestion key={index} id={sugg.user_id} login={sugg.senderId} avatar={sugg.SenderAv} type="requestReception" bgColor='#AFEEEE'/>)}
            </Stack>
        </Container>
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
      if(socket.connected){
        socket.disconnect()  // cleanUp function when component unmount
      }
      // dispatch(setSelectedItem(''))
    }
  }, [])
 
    socket.off('friendBlocked').on('friendBlocked', (data: any) => {
      dispatch(FetchAllBlockedFriends())
    })

    // socket.off('newCookie').on('newCookie', (data) => {
    //   console.log('[Friends] -- je rentre ???', data)
    //   dispatch(setOnlyTokens({...data}));
    //   const serializeData = JSON.stringify(data);
    //   Cookies.set('Authcookie', serializeData, { path: '/' });
    // })

    socket.off('acceptedFriend').on('acceptedFriend', (data: any) => {
      if (data != null)
        dispatch(FetchAllFriends())
      else dispatch(setFriendshipError(2))
     })
  const friends = useAppSelector(selectFriends);
  const blocked = useAppSelector(selectBlockedFriends)
  
//   console.log("frieeeends ", friends);
  const content = (
      <Container maxWidth="lg" fixed sx={{
        margin: '1%',
      }}>
      <Typography 
        sx={{
          fontWeight: 'bold',
          fontSize: '30px',
          color: '#07457E',
          textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
          margin: 4,
        }}
      > Your friends... </Typography>
      <Stack  spacing={3} sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems:'flex-end',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
      }} >
      
          {friends && friends.map((sugg: any, index) => 
            <FriendSuggestion key={index} id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="myFriends" bgColor='#AFEEEE'/>)}
            {blocked && blocked.map((sugg: any, index) => 
            <FriendSuggestion key={index} id={sugg.user_id} login={sugg.login} avatar={sugg.avatar} type="blockedFriends" bgColor='grey'/>)}
      </Stack>
    </Container>
  )
  return content;
}

export { Suggestions, Requests, Friends };