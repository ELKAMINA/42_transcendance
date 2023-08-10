import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { useState } from 'react';
import { Stack } from '@mui/material';
import { PersonalInformation, Security } from '../../pages/settings';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { selectItems, setSelectedItem } from '../../redux-features/auth/authSlice';


interface Myprops {
  items: string[];
}

export default function SettingsComponent(props: Myprops) {
  const [selectedIndex, setSelectedIndex] = useState(1);
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
      switch (selectedItem) {
        case 'Personal Information':
          return <PersonalInformation />;
        case 'Security':
          return <Security />;
        default:
          return <PersonalInformation />;
      }
    }
    React.useEffect(() => {
      return () => {
        setSelectedIndex(1)
      }
    })
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh'}}>
    <CssBaseline/>
      <Stack sx={{
        background: 'linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 100%)',
        width: '30%',
      }}
      >
            <List>
              {items.map((text, index) => (
                <ListItem key={text}>
                  <ListItemButton
                  selected={selectedIndex === 0}
                  onClick={(event) => handleSbClick(event, 0, text)}>
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

                    } />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Stack>
        {renderSelectedBox()}
    </Box>
  );
}
