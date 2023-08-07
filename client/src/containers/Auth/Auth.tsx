import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Sign from '../../components/Sign';
import { Container, CssBaseline } from '@mui/material';

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
        <Box sx={{ p: 5 }}>
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
      <Container component="main" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        minWidth: '100vw',
        background: 'linear-gradient(180deg, #07457E 10%, rgba(0, 151, 160, 0.69) 80%)',
      }}>
        <CssBaseline/>
          <Box sx={{
            // marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'white',
            height: '100%',
            width: '55%',
            margin: '7%',
            borderRadius: '16%',
          }}>
              <Typography sx={{
                marginBottom: '40px',
                marginTop: '40px',
                fontFamily: 'sans-serif',
                color: 'whitesmoke',
                alignContent: 'center',
              }} 
              component="h1" variant="h3"></Typography>
              <Box>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab
                      sx={{
                        fontSize: '18px',
                      }}
                    label="Sign Up" {...a11yProps(0)} />
                    <Tab 
                      sx={{
                        fontSize: '18px',
                      }}
                    label="Sign In" {...a11yProps(1)} />
                  </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                  <Sign intro="NewBie? Let's sign up" type="Sign up"/>
              </TabPanel>
              <TabPanel value={value} index={1}>
                  <Sign intro="Veteran? Let's sign in" type="Sign in"/>
              </TabPanel>
          </Box>
      </Container>
    );
}