/* *** External imports *** */
import * as React from "react";
import Button from "@mui/material/Button";
import { Box, Stack, Typography, Drawer, styled } from "@mui/material";
// import { useDispatch } from 'react-redux';
/* *** Internal imports *** */
import "./home.css";
import Navbar from "../components/NavBar.tsx";
import { useNavigate } from "react-router-dom";
import Leaderboard from "../components/Leaderboard/Leaderboard.tsx";


// export const HomeSock = io('http://localhost:4001/home');


const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '.MuiDrawer-paper': {
      width: '50vw',
    },
  }));

  const ObliqueBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '100%',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      transform: 'skewX(-20deg)',
      transformOrigin: 'top right',
      background: 'linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2))',
      pointerEvents: 'none', // to not interfere with drawer interactions
    },
  }));


function HomePage() {
    const navigate = useNavigate();
    const currentRoute = window.location.pathname;
    const [openLeaderboard, setOpenl] = React.useState(false)

    const play = () => {
        navigate("/game");
    };

    const openLboard = (open: boolean) => (event: React.MouseEvent) => {
        console.log('i got herre ?')
       setOpenl(open);
    };

    const content = (
        <>
            <Navbar currentRoute={currentRoute}/>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                // width: '100%',
                height: '100vh',
                overflow: 'hidden',
                alignItems: 'center',
                p: 4,
                background: 'linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 97%)'
            }}>
                <Typography sx={{
                    fontSize: 200,
                    letterSpacing: 6,
                    fontFamily: 'Press Start 2P',
                    color: '#07457E',
                    opacity: '0.4',
                    textShadow:   '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #0ff, 0 0 70px #0ff, 0 0 80px #0ff, 0 0 100px #0ff, 0 0 150px #0ff',
                    '&:hover': {
                        textShadow: '0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #ff0, 0 0 30px #ff0, 0 0 40px #f0f',
                    },
                }}>
                    PONG
                </Typography>
                <Stack>
                    <Button size='large' sx={{
                        fontSize: 50,
                        fontFamily: 'Press Start 2P',
                        color: '#d5f4e6',
                        textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                        transition: 'all 0.3s ease',
                    }} onClick={play}>
                        PLAY NOW
                    </Button>
                    <Button size='large' sx={{
                        fontSize: 50,
                        fontFamily: 'Press Start 2P',
                        color: '#d5f4e6',
                        textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                        transition: 'all 0.3s ease',
                    }} onClick={openLboard(true)}>
                        Leaderboard
                    </Button>
                </Stack>
            </Box>
            {openLeaderboard && (
                <StyledDrawer 
                anchor='right' 
                open={openLeaderboard} 
                onClose={openLboard(false)}
              >
                <ObliqueBox>
                    <Leaderboard/>
                </ObliqueBox>
              </StyledDrawer>
      )}
        </>
    );
    return content;
}

export default HomePage;
