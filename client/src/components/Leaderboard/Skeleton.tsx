
import * as React from "react";
import { Grid } from "@mui/material";
import Paper from '@mui/material/Paper';
import Avatar from "@mui/material/Avatar";
import {CssBaseline} from "@mui/material";
import Typography from "@mui/material/Typography";

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
    const user = useAppSelector(selectCurrentUser)
    React.useEffect(() => {}, []);
    return (
        <>
        <CssBaseline/>
        <Paper
            sx={{
                width: '95%',
                borderRadius: '15%',
                background: props.login === user ? "linear-gradient(180deg, #FFD700 0%, rgba(0, 181, 160, 0.19) 50%)" : "linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.59) 50%)" ,
                p: 1,
                m:1,
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
                            <Typography gutterBottom variant="h6" component="div">
                                Rank: {props.rank}
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
