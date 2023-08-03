import Grid from "@mui/material/Grid"; // Grid version 1
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { gameInfo } from "../../data/gameInfo";
import Navbar from "../../components/NavBar";
import { PongProps } from "../../data/gameInfo";

const waitingGridStyle = {
    height: "100vh",
    backgroundColor: "#AFDBF5",
    color: "#005A9C",
};

export const Matchmaking: React.FC<PongProps> = ({ room }) => {
    const currentRoute = window.location.pathname;

    return (
        <>
            <Navbar currentRoute={currentRoute} />
            <Grid container spacing={1} alignItems="center">
                {!room.isFull && (
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
