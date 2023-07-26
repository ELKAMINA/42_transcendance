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
        <Grid
            container
            spacing={4}
            // justifyContent={"space-between"}
            sx={{
                width: "50vw",
                height: "10vh",
                borderRadius: "20px",
                alignItems: "center",
                background:
                    "linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 97%)",
                // display: "flex",
                // flexDirection: "row",
                // justifyContent: "space-between",
            }}
        >
            <Grid item>
                <Avatar src={props.avatar} sx={{ width: 100, height: 100 }} />
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
    );
};
export default LeaderboardRow;
