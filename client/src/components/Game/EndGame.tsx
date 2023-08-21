import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { Box, Grid, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";

import Navbar from "../../components/NavBar";
import { IPongProps } from "../../interface/IClientGame";
import { useAppSelector } from "../../utils/redux-hooks";
import { selectCurrentUser } from "../../redux-features/auth/authSlice";

const EndGame: React.FC<IPongProps> = ({ room }) => {
    const user = useAppSelector(selectCurrentUser);
    const [open, setOpen] = useState(true);
    const [resultMsg, setResultMsg] = useState("You win");
    const [resultMsgColor, setResultMsgColor] = useState("#07457E"); // #07457E = blue
    const [resultMsgShadow, setResultMsgShadow] = useState(
        "0 0 5px #00ff51,0 0 10px #00ff51, 0 0 15px #00ff51, 0 0 20px #00ff51, 0 0 30px #00ff51, 0 0 40px #00ff51"
    ); // "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff" = blue
    const resultMsgLoose = "You loose";
    const resultMsgLooseColor = "#07457E";
    const resultMsgLooseShadow =
        "0 0 5px #ff0000,0 0 10px #ff0000, 0 0 15px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000";
    const currentRoute = window.location.pathname;
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/welcome");
    };

    useEffect(() => {
        switch (user) {
            case room.players[0]:
                if (room.scorePlayers[0] < room.scorePlayers[1]) {
                    setResultMsg(resultMsgLoose);
                    setResultMsgColor(resultMsgLooseColor);
                    setResultMsgShadow(resultMsgLooseShadow);
                }
                break;
            default:
                if (room.scorePlayers[1] < room.scorePlayers[0]) {
                    setResultMsg(resultMsgLoose);
                    setResultMsgColor(resultMsgLooseColor);
                    setResultMsgShadow(resultMsgLooseShadow);
                }
        }
    }, []);

    return (
        <>
            <Navbar currentRoute={currentRoute} />
            <Box
                sx={{
                    height: "100vh",
                    alignItems: "center",
                    background:
                        "linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 97%)",
                }}
            >
                <Dialog
                    fullScreen={false}
                    maxWidth={"sm"}
                    open={open}
                    onClose={goHome}
                >
                    <DialogTitle>
                        <Typography
                            align="center"
                            sx={{
                                fontSize: 50,
                                margin: 1,
                                color: resultMsgColor,
                                textShadow: resultMsgShadow,
                                transition: "all 0.3s ease",
                            }}
                        >
                            {resultMsg}
                        </Typography>
                    </DialogTitle>
                    <Stack>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={30}>
                                    <Typography
                                        align="center"
                                        component="div"
                                        sx={{
                                            margin: 1,
                                            color: "#07457E",
                                            textShadow:
                                                "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        {room.players[0]} Vs {room.players[1]}
                                    </Typography>

                                    <Typography
                                        align="center"
                                        component="div"
                                        sx={{
                                            margin: 1,
                                            color: "#07457E",
                                            textShadow:
                                                "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        {room.scorePlayers[0]} :{" "}
                                        {room.scorePlayers[1]}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                size="medium"
                                autoFocus
                                onClick={goHome}
                            >
                                Go to Welcome Page
                            </Button>
                        </DialogActions>
                    </Stack>
                </Dialog>
            </Box>
        </>
    );
};

export default EndGame;
