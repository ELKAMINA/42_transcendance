/* *** External imports *** */
import * as React from "react";
import Button from "@mui/material/Button";
import { Box, Stack, Typography, Drawer, styled } from "@mui/material";
// import { useDispatch } from 'react-redux';
/* *** Internal imports *** */
import "./home.css";
import Navbar from "../components/NavBar.tsx";
import { useNavigate } from "react-router-dom";
import { EClientPlayType } from "../enum/EClientGame.tsx";
import { useAppDispatch } from "../utils/redux-hooks.tsx";
import Leaderboard from "../components/Leaderboard/Leaderboard.tsx";
import { updateOnGamePage } from "../redux-features/game/gameSlice.tsx";



const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '.MuiDrawer-paper': {
      width: '50vw',
    },
  }));

  const ObliqueBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '100vh',
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
    const dispatch = useAppDispatch()
    const currentRoute = window.location.pathname;
    const [openLeaderboard, setOpenl] = React.useState(false)

    const play = () => {
        navigate(`/game?data`, {
            state: {
                data: {
                    type: EClientPlayType.RANDOM,
                    sender: "",
                    receiver: "",
                },
            },
        });
    };

    React.useEffect(() => {
        dispatch(updateOnGamePage(0));
    }, [dispatch]);
    
    const openLboard = (open: boolean) => (event: React.MouseEvent) => {
       setOpenl(open);
    };

    const content = (
        <>
            <Navbar currentRoute={currentRoute}/>
            <Box sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
                alignItems: 'center',
                p: 4,
                background: 'linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 97%)',
                justifyContent: 'center',
                [theme.breakpoints.up('md')]: {
                    alignItems: 'center', // center alignment for larger screens
                    padding: theme.spacing(8), // more padding for larger screens
                    justifyContent: 'center',
                },
                [theme.breakpoints.down('sm')]: {
                    alignItems: 'center', // left alignment for smaller screens
                    justifyContent: 'center', 
                },
                [theme.breakpoints.down('xs')]: {
                    alignItems: 'center', // left alignment for smaller screens
                }
            })}>
                <Typography sx={(theme)=> ({
                    fontSize: {
                        xs: 60,
                        sm: 110,
                        md: 150,
                        lg: 200,
                    },
                    letterSpacing: 6,
                    fontFamily: 'Press Start 2P',
                    color: '#07457E',
                    opacity: '0.4',
                    margin: 3,
                    textShadow:   '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #0ff, 0 0 70px #0ff, 0 0 80px #0ff, 0 0 100px #0ff, 0 0 150px #0ff',
                    '&:hover': {
                        textShadow: '0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #ff0, 0 0 30px #ff0, 0 0 40px #f0f',
                    },
                })}>
                    PONG
                </Typography>
                <Stack direction={{xs: 'column', md: 'column', lg: 'column', sm:'column'}} spacing={2}>
                    <Button size='large' sx={(theme)=> ({
                        fontSize: {
                            xs: 20,
                            sm: 30,
                            md: 40,
                            lg: 50,
                        },
                        fontFamily: 'Press Start 2P',
                        color: '#d5f4e6',
                        textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                        transition: 'all 0.3s ease',
                    })}  onClick={play}>
                        PLAY NOW
                    </Button>
                    <Button size='large'
                    sx={(theme)=> ({
                        fontSize: {
                            xs: 20,
                            sm: 30,
                            md: 40,
                            lg: 50,
                        },
                        fontFamily: 'Press Start 2P',
                        color: '#d5f4e6',
                        textShadow: '0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff',
                        transition: 'all 0.3s ease',
                    })} onClick={openLboard(true)}>
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
