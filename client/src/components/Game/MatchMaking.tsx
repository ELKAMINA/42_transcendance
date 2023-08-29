import Grid from "@mui/material/Grid"; // Grid version 1
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Navbar from "../../components/NavBar";
import { IPongProps } from "../../interface/IClientGame";

const waitingGridStyle = {
    height: "100vh",
    backgroundColor: "#AFDBF5",
    color: "#005A9C",
};

const Matchmaking: React.FC<IPongProps> = ({ room }) => {
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
                        <Typography
                            noWrap
                            sx={(theme) => ({
                                fontSize: {
                                    xs: 20,
                                    sm: 35,
                                    md: 50,
                                    lg: 90,
                                },
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                            })}
                        >
                            Waiting for your opponent{" "}
                        </Typography>
                        <CircularProgress color="primary" />
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default Matchmaking;
