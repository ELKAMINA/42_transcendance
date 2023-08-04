/* *** External imports *** */
import * as React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
// import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from "../utils/redux-hooks.tsx";
/* *** Internal imports *** */
import "./home.css";
import Navbar from "../components/NavBar.tsx";
import { selectCurrentUser } from "../redux-features/auth/authSlice.tsx";
import { useNavigate } from "react-router-dom";
import LeaderboardRow from "./../components/Leaderboard/Skeleton.tsx";
import {
    FetchLeaderBoard,
    selectLeaderBoard,
    updateOnGamePage,
} from "../redux-features/game/gameSlice.tsx";
import { EClientPlayType } from "../enum/EClientGame.tsx";

// export const HomeSock = io('http://localhost:4001/home');

function HomePage() {
    const user = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();
    const currentRoute = window.location.pathname;
    const dispatch = useAppDispatch();
    // const access_token = useAppSelector(selectCurrentAccessToken)
    // const refresh_token = useAppSelector(selectCurrentRefreshToken)
    const welcome = user
        ? `Welcome ${user} to PONG GAME`
        : "Welcome buddy to PONG GAME";
    // const a_tokenAbbr = `${access_token.slice(0, 10)}...`
    // const r_tokenAbbr = `${refresh_token.slice(0,10)}...`

    const play = () => {
        navigate(`/game?data`, {
            state: {
                data: {
                    type: EClientPlayType.RANDOM,
                    sender: "",
                    receiver: "",
                },
            },
        });
    };

    React.useEffect(() => {
        dispatch(updateOnGamePage(0));
        dispatch(FetchLeaderBoard());
    }, []);

    // console.log(
    //     ` La reponse du serveur ${leaderboard} et son type est  ${typeof leaderboard}`
    // );
    const leaderboard = useAppSelector(selectLeaderBoard);
    // console.log(" from client is leaderboard ok ? ", leaderboard);
    const content = (
        <>
            <Navbar currentRoute={currentRoute} />
            <Box>
                <Stack
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <h1 className="welcome">{welcome}</h1>
                    <Button
                        onClick={play}
                        sx={{
                            width: "200px",
                            height: "50px",
                            background:
                                "linear-gradient(180deg, #07457E 0%, rgba(0, 181, 160, 0.69) 97%)",
                            color: "white",
                            font: "bold",
                            fontSize: "30px",
                        }}
                    >
                        PLAY
                    </Button>
                </Stack>
                <Stack
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                    spacing={2}
                >
                    {leaderboard &&
                        leaderboard.map((element: any, i: number) => (
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
                        ))}
                </Stack>
            </Box>
        </>
    );
    return content;
}

export default HomePage;
