import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { selectItems, setSelectedItem } from '../../redux-features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { useState } from 'react';

import { PersonalInformation, Security } from '../../pages/settings';

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
    
  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline/>
      <Drawer className='drawer'
        variant="permanent"
        sx={{
          width: '30vw',
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: '30vw', boxSizing: 'border-box', background: 'linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 100%)'},
        }}
      >
        <Toolbar />
        <Box sx={{ 
          overflow: 'auto',
          }}>
          <List>
            {items.map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleSbClick(event, 0, text)}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flex: 1, p: 3, overflow:'hidden'}}>
        <Toolbar />
        <div>{renderSelectedBox()}</div>
      </Box>
    </Box>
  );
}
