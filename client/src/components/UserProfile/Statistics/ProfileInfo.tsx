import * as React from 'react';
// import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Statistics from './Skeleton';
import { Rank, Wins, Loss, TotalMatches} from './Scores';
import { UserPrisma } from '../../../data/userList';


interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

interface Myprops {
  interestProfile: Record<string,string>,
}

export default function ProfileInfo(props: Myprops) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', width: '90vw'}}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Statistics" {...a11yProps(0)} sx={{ backgroundColor: '#07457E'}} />
          <Tab label="Events" {...a11yProps(1)} sx={{ backgroundColor: '#07457E'}}/>
        </Tabs>
      </AppBar>

        <TabPanel value={value} index={0} dir={theme.direction}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignContent: 'center',
            flexWrap: 'wrap',
            }}>
            <Rank him={props.interestProfile}/>
            <Wins him={props.interestProfile}/>
            <Loss him={props.interestProfile}/>
            <TotalMatches him={props.interestProfile}/>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Events
        </TabPanel>
    </Box>
  );
}
