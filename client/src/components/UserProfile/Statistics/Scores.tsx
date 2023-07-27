import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Statistics from "./Skeleton";
import { useAppDispatch, useAppSelector } from "../../../utils/redux-hooks";
import {
    selectTotalPlayers,
    FetchTotalPlayers,
} from "../../../redux-features/game/gameSlice";
import { UserModel } from "../../../types/users/userType";
// import { selectTotalPlayers, FetchTotalPlayers, FetchTotalMatchesWon, FetchTotalMatchesLost, FetchTotalPoints } from '../../../redux-features/game/gameSlice';

interface Myprops {
    him: UserModel;
}

const Rank = (props: Myprops) => {
    let rank: string = "";
    if (props.him.rank === null) {
        rank = "0";
    } else {
        rank = props.him.rank.toString();
    }
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch(FetchTotalPlayers());
    }, []);
    const totalPlayers = useAppSelector(selectTotalPlayers);
    return (
        <Statistics name="Rank" data={rank} />
        // <div> Hello</div>
    );
};

const Wins = (props: Myprops) => {
    let wins: string = "";
    if (props.him.totalWins === null) {
        wins = "0";
    } else {
        wins = props.him.totalWins.toString();
    }
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        // dispatch(FetchTotalMatchesWon());
    }, []);
    // const totalPlayers = useAppSelector(selectTotalPlayers);
    return <Statistics name="Wins" data={wins} />;
};

const Loss = (props: Myprops) => {
    let loss: string = "";
    if (props.him.totalloss === null) {
        loss = "0";
    } else {
        loss = props.him.totalloss.toString();
    }
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        // dispatch(FetchTotalMatchesWon());
    }, []);
    // const totalPlayers = useAppSelector(selectTotalPlayers);
    return <Statistics name="Defeats" data={loss} />;
};

const TotalMatches = (props: Myprops) => {
    let matches: string = "";
    if (props.him.totalMatches === null) {
        matches = "0";
    } else {
        matches = props.him.totalMatches.toString();
    }
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        // dispatch(FetchTotalMatchesWon());
    }, []);
    // const totalPlayers = useAppSelector(selectTotalPlayers);
    return <Statistics name="Total battles" data={matches} />;
};

const Level = (props: Myprops) => {
    let lv: string = "";
    if (props.him.level === null) {
        lv = "0";
    } else {
        lv = props.him.level.toString();
    }
    // const dispatch = useAppDispatch();
    React.useEffect(() => {
        // dispatch(FetchTotalMatchesWon());
    }, []);
    // const totalPlayers = useAppSelector(selectTotalPlayers);
    return <Statistics name="Level" data={lv} />;
};

export { Rank, Wins, Loss, TotalMatches, Level };
// export default Rank
