import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import * as React from "react";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid } from "@mui/material";
import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { Rowing } from "@mui/icons-material";
import {CssBaseline} from "@mui/material";
import Paper from '@mui/material/Paper';

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
    React.useEffect(() => {}, []);
    return (
        <>
        <CssBaseline/>
        <Paper
            sx={{
                width: '100%',
                borderRadius: '3%',
                background: "linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 97%)",
            }}
            elevation={12}
        >
            <Grid container spacing={1}>
                <Grid item>
                    <Avatar src={props.avatar} sx={{ width: 50, height: 50 }} />
                </Grid>
                <Grid item sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="h5" component="div">
                                {props.login}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total matches played : {props.totalMatches}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total matches won : {props.totalWins}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total matches lost : {props.totalloss}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item sm container>
                    <Grid item xs container direction="column" spacing={3}>
                        <Grid item xs>
                            <Typography gutterBottom variant="h5" component="div">
                                {props.rank}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total cumul points: {props.level}
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
