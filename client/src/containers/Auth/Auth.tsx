import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Sign from '../../components/Sign';
import './Auth.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component='div'>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function AuthContainer(){
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
    return (
      <section className='auth'>
        <h2 className='auth-welcome'>Welcome to Undergroung Pong</h2>
        <div className='auth-menu'>
          <Box className='auth-menu'>
              <Box>
                <div className='auth-options'>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Sign Up" {...a11yProps(0)} />
                    <Tab label="Sign In" {...a11yProps(1)} />
                  </Tabs>
                </div>
              </Box>
            <div className='auth-inputs'>
              <TabPanel value={value} index={0}>
                  <Sign intro="NewBie? Let's sign up" type="Sign up"/>
              </TabPanel>
              <TabPanel value={value} index={1}>
                  <Sign intro="Veteran? Let's sign in" type="Sign in"/>
              </TabPanel>
            </div>
          </Box>
        </div>
      </section>
    );
}