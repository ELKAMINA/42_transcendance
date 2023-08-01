import Grid from "@mui/material/Grid"; // Grid version 1
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { gameInfo } from "../../data/gameInfo";
import Navbar from "../../components/NavBar";


const halfGridStyle = {
    height: "100vh",
    background: "rgba(255, 255, 255, 0.5)",
};

const waitingGridStyle = {
    height: "100vh",
    backgroundColor: "#AFDBF5",
    color: "#005A9C",
};

interface PongProps {
    room: gameInfo,
}

export const Matchmaking: React.FC<PongProps> = ({ room }) => {
    const currentRoute = window.location.pathname;
    const [versus, setVersusScreen] = useState(false)
    useEffect(() => {
        let timerId: any;
        if (room.isFull === true) {
            setVersusScreen(true)
            timerId = setTimeout(() => {
                setVersusScreen(false);
            }, 4000);
        }
        return () => clearTimeout(timerId);
    }, [room.isFull]);

    return (
        <>
            <Navbar currentRoute={currentRoute} />
            <Grid container spacing={1} alignItems="center">
                {versus === true && (
                    <>
                        <Grid
                            container
                            sx={{
                                backgroundImage: `url(${
                                    process.env.PUBLIC_URL + "/thisone.avif"
                                })`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                imageRendering: "auto",
                                height: "95vh",
                                width: "100wh",
                                zIndex: 0,
                            }}
                        >
                            <Grid
                                item
                                style={halfGridStyle}
                                xs={6}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        color: "white",
                                        fontSize: "50px",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {room.players[0]}
                                </Typography>
                            </Grid>
                            {/* <Typography variant="h3" noWrap>VS</Typography> */}
                            <Grid
                                item
                                style={halfGridStyle}
                                xs={6}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    noWrap
                                    sx={{
                                        color: "white",
                                        fontSize: "50px",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {room.players[1]}
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
                )}
                {!room.isFull && versus === false && (
                    <Grid
                        item
                        xs={12}
                        style={waitingGridStyle}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="h2" noWrap>
                            Waiting for your opponent{" "}
                        </Typography>
                        <CircularProgress color="primary" />
                    </Grid>
                )}
            </Grid>
        </>
    );
};
