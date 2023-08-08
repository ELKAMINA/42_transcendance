import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { io } from 'socket.io-client';
import { Stack, Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import CssBaseline from '@mui/material/CssBaseline';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { Suggestions, Requests, Friends } from '../pages/friendship';
import { selectItems, setSelectedItem } from '../redux-features/friendship/friendshipSlice';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { useState } from 'react';

export const socket = io('http://localhost:4006', {
  withCredentials: true,
  transports: ['websocket'],
  upgrade: false,
  autoConnect: false,
  // reconnection: false,
})
interface Myprops {
  items: string[];
}

export default function FriendshipComponent(props: Myprops) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dispatch = useAppDispatch();
  const selectedItem = useAppSelector(selectItems);
    
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
        socket.disconnect()
      }
    })
    
  return (
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
                        style={{ fontWeight: 'bold',
                        fontSize: 20,
                        color: '#07457E',
                        textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                      }}
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
  );
}
