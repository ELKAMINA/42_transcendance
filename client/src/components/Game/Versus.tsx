import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid"; // Grid version 1
import { CssBaseline, Typography } from "@mui/material";
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
        }, 1000);
        return () => {
            clearTimeout(timerId);
        };
    }, []);

    return (
        <>
            <Navbar currentRoute={currentRoute} />
            <CssBaseline>
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
                                        sx={(theme) => ({
                                            fontSize: {
                                                xs: 20,
                                                sm: 25,
                                                md: 30,
                                                lg: 60,
                                            },
                                            color: "white",
                                            textTransform: "uppercase",
                                            fontWeight: "bold",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                        })}
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
                                        noWrap
                                        sx={(theme) => ({
                                            fontSize: {
                                                xs: 20,
                                                sm: 25,
                                                md: 30,
                                                lg: 60,
                                            },
                                            color: "white",
                                            textTransform: "uppercase",
                                            fontWeight: "bold",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                        })}
                                    >
                                        {room.players[1]}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </>
                    }
                </Grid>
            </CssBaseline>
        </>
    );
};

export default Versus;
