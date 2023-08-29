import * as React from "react";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { CssBaseline } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";

import api from "../../utils/Axios-config/Axios";
import { useAppSelector } from "../../utils/redux-hooks";
import { selectCurrentUser } from "../../redux-features/auth/authSlice";

interface Myprops {
    avatar: string;
    rank: number;
    login: string;
    totalMatches: number;
    totalWins: number;
    totalloss: number;
    level: number;
}

const LeaderboardRow = (props: Myprops) => {
    const user = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();
    React.useEffect(() => {}, []);

    const handleProfile = async (name: string) => {
        await api
            .get("http://localhost:4001/user/userprofile", {
                params: {
                    ProfileName: name,
                },
            })
            .then((res) => {
                navigate(`/userprofile?data`, { state: { data: res.data } });
            })
            .catch((e) => {
                console.log("ERROR from request with params ", e);
            });
    };

    return (
        <>
            <CssBaseline />
            <Paper
                sx={{
                    width: "95%",
                    borderRadius: "15%",
                    background:
                        props.login === user
                            ? "linear-gradient(180deg, #FFD700 0%, rgba(0, 181, 160, 0.19) 50%)"
                            : "linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.59) 50%)",
                    p: 1,
                    m: 1,
                }}
                elevation={12}
            >
                <Grid container spacing={1}>
                    <Grid item>
                        <Button onClick={() => handleProfile(props.login)}>
                            <Avatar
                                src={props.avatar}
                                sx={{ width: 50, height: 50 }}
                            />
                        </Button>
                    </Grid>
                    <Grid item sm container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography
                                    sx={(theme) => ({
                                        fontSize: {
                                            xs: 10,
                                            sm: 15,
                                            md: 20,
                                            lg: 25,
                                        },
                                        fontWeight: "bold",
                                    })}
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                >
                                    {props.login}
                                </Typography>
                                <Typography
                                    sx={(theme) => ({
                                        fontSize: {
                                            xs: 10,
                                            sm: 11,
                                            md: 12,
                                            lg: 15,
                                        },
                                        fontWeight: "italic",
                                    })}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    <span style={{ fontWeight: "bold" }}>
                                        Total matches played :
                                    </span>{" "}
                                    {props.totalMatches}
                                </Typography>
                                <Typography
                                    sx={(theme) => ({
                                        fontSize: {
                                            xs: 10,
                                            sm: 11,
                                            md: 12,
                                            lg: 15,
                                        },
                                        fontWeight: "italic",
                                    })}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    <span style={{ fontWeight: "bold" }}>
                                        {" "}
                                        Total matches won :{" "}
                                    </span>{" "}
                                    {props.totalWins}
                                </Typography>
                                <Typography
                                    sx={(theme) => ({
                                        fontSize: {
                                            xs: 10,
                                            sm: 11,
                                            md: 12,
                                            lg: 15,
                                        },
                                        fontWeight: "italic",
                                    })}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    <span style={{ fontWeight: "bold" }}>
                                        {" "}
                                        Total matches lost :{" "}
                                    </span>{" "}
                                    {props.totalloss}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item sm container>
                        <Grid item xs container direction="column" spacing={3}>
                            <Grid item xs>
                                <Typography
                                    sx={(theme) => ({
                                        fontSize: {
                                            xs: 10,
                                            sm: 15,
                                            md: 20,
                                            lg: 25,
                                        },
                                        fontWeight: "italic",
                                    })}
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                >
                                    Rank: {props.rank}
                                </Typography>
                                <Typography
                                    sx={(theme) => ({
                                        fontSize: {
                                            xs: 10,
                                            sm: 11,
                                            md: 12,
                                            lg: 15,
                                        },
                                        fontWeight: "italic",
                                    })}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    <span style={{ fontWeight: "bold" }}>
                                        {" "}
                                        Total cumul points:{" "}
                                    </span>{" "}
                                    {props.level}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
};
export default LeaderboardRow;
