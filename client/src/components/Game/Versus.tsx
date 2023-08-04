import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid"; // Grid version 1
import { Typography } from "@mui/material";
import { IPongProps } from "../../interface/IClientGame";
import Navbar from "../../components/NavBar";
import { socket } from "../../pages/game";

const halfGridStyle = {
    height: "100vh",
    background: "rgba(255, 255, 255, 0.5)",
};

const Versus: React.FC<IPongProps> = ({ room }) => {
    const currentRoute = window.location.pathname;
    const navigate = useNavigate();

    // HANDLE THE GAME
    useEffect(() => {
        let timerId: any;

        timerId = setTimeout(() => {
            socket.emit("RequestGameOn");
        }, 4000);
        return () => {
            clearTimeout(timerId);
        };
    }, []);

    return (
        <>
            <Navbar currentRoute={currentRoute} />
            <Grid container spacing={1} alignItems="center">
                {
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
                }
            </Grid>
        </>
    );
};

export default Versus;
