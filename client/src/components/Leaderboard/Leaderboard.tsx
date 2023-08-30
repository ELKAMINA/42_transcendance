import React from "react";
import { Box, CssBaseline, Grid, Typography } from "@mui/material";

import LeaderboardRow from "./Skeleton";
import { useAppDispatch, useAppSelector } from "../../utils/redux-hooks";
import {
    selectLeaderBoard,
    FetchLeaderBoard,
} from "../../redux-features/game/gameSlice";

function Leaderboard() {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(FetchLeaderBoard());
    }, [dispatch]);

    const leaderboard = useAppSelector(selectLeaderBoard);
    // console.log("le leaderboard ", leaderboard);
    return (
        <Box>
            <CssBaseline>
                <Typography
                    align="center"
                    variant="h3"
                    component="div"
                    sx={{
                        margin: 3,
                        color: "#07457E",
                        textShadow:
                            "0 0 5px #0ff,0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
                        transition: "all 0.3s ease",
                    }}
                >
                    Leaderboard
                </Typography>
                <Grid container spacing={1}>
                    {leaderboard &&
                        leaderboard.map((element: any, i: number) => (
                            <Grid container item key={i}>
                                <LeaderboardRow
                                    key={i}
                                    avatar={element.avatar}
                                    rank={element.rank}
                                    totalMatches={element.totalMatches}
                                    totalWins={element.totalWins}
                                    totalloss={element.totalloss}
                                    login={element.login}
                                    level={element.level}
                                />
                            </Grid>
                        ))}
                </Grid>
            </CssBaseline>
        </Box>
    );
}

export default Leaderboard;
