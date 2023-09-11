import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { io } from 'socket.io-client';
import ListItem from '@mui/material/ListItem';
import CssBaseline from '@mui/material/CssBaseline';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Stack, Typography } from '@mui/material';

import { Suggestions, Requests, Friends } from '../pages/friendship';
import { selectItems, setSelectedItem, selectError, FetchAllFriendRequests, setFriendshipError, FetchSuggestions, FetchAllFriends, FetchAllBlockedFriends, FetchUsersDb } from '../redux-features/friendship/friendshipSlice';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { useState } from 'react';
import SomethingWentWrong from '../pages/somethingWentWrong';

export const socket = io('http://localhost:4006', {
  withCredentials: true,
  transports: ['websocket'],
  upgrade: false,
  autoConnect: false,
  // reconnection: true,
})
interface Myprops {
  items: string[];
}

export default function FriendshipComponent(props: Myprops) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dispatch = useAppDispatch();
  const selectedItem = useAppSelector(selectItems);
  const err = useAppSelector(selectError)
    
    const { items } = props;
    const handleSbClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: number,
      text: any) => {
        dispatch(setSelectedItem(text));
    }
    const renderSelectedBox = () => {
      // console.log('selected Item = ', selectedItem)
      switch (selectedItem) {
        case 'Suggestions':
          return <Suggestions />;
        case 'Requests':
          return <Requests />;
        case 'Friends':
          return <Friends />;
        default:
          return <Suggestions />;
      }
    }
    React.useEffect(() => {
      socket.connect()

      return () => {
        // dispatch(setFriendshipError(0))
        setSelectedIndex(0)
        if (socket.connected){
          socket.disconnect()
        }
      }
    })

    // socket.off('newCookie').on('newCookie', (data) => {
    //   // console.log('je rentre ???', data)
    //   dispatch(setOnlyTokens({...data}));
    //   const serializeData = JSON.stringify(data);
    //   Cookies.set('Authcookie', serializeData, { path: '/' });
    // })


    const handleChildAction = (err: number) => {
      switch (err) {
        case 1:
          dispatch(setFriendshipError(0))
          dispatch(FetchUsersDb())
          break;
        case 2:
          dispatch(setFriendshipError(0))
          dispatch(FetchAllFriendRequests())
          break;
        case 4:
            dispatch(setFriendshipError(0))
            dispatch(FetchSuggestions())
            break;
        case 5:
          dispatch(setFriendshipError(0))
          dispatch(FetchAllFriends())
          break;
        case 6:
          dispatch(setFriendshipError(0))
          dispatch(FetchAllBlockedFriends())
          break;
        default:
          break;
      }
    }

    /** ISSUE 113 - TEST AUTO REFRESH WHEN USER NAME CHANGING ***/
    socket.off("autoRefreshWhenUsernameChanging").on("autoRefreshWhenUsernameChanging", async () => {
      // console.log("[AllFriendship - on autoRefreshWhenUsernameChanging", "Messagge received from the Settings");
        dispatch(FetchSuggestions());
        dispatch(FetchAllFriendRequests());
        dispatch(FetchAllFriends());
        dispatch(FetchAllBlockedFriends());
    })
    
  return (
    <>
      {(!err || err === 0) && (
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100vw', minHeight: '100vh', overflowY: 'auto'}}>
          <CssBaseline/>
            <Stack sx={{
              background: 'linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 100%)',
              width: '30%',
              height: '100vh',
              overflowY: 'auto',
              maxHeight: "100vh",
            }}
            >
              <List>
                {items.map((text, index) => (
                  <ListItem
                  key={text} alignItems="flex-start"
                  disableGutters
                  >
                    <ListItemButton
                        selected={selectedIndex === 0}
                        onClick={(event) => handleSbClick(event, 0, text)}
                        style={{ backgroundColor: selectedIndex === 0 ? 'transparent' : undefined }}
                      >
                      <ListItemText primary={
                        <Typography
                        sx={(theme)=> ({
                          fontSize: {
                              xs: 7,
                              sm: 10,
                              md: 17,
                              lg: 20,
                          },
                          fontWeight: 'bold',
                          color: '#07457E',
                          textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                      })}
                        >
                          {text}
                        </Typography>
                        } 
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Stack>
              {renderSelectedBox()}
            </Box>
          )
      }
      {(err > 0) && <SomethingWentWrong onAction={handleChildAction}/>}
    </>
  );
}
