import * as React from "react";
import Statistics from "./Skeleton";

import { UserModel } from "../../../types/users/userType";
import { useAppDispatch} from "../../../utils/redux-hooks";
import {FetchTotalPlayers} from "../../../redux-features/game/gameSlice";
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
    }, [dispatch]);

    return (
        <Statistics name="Rank" data={rank} />
    );
};

const Wins = (props: Myprops) => {
    let wins: string = "";
    if (props.him.totalWins === null) {
        wins = "0";
    } else {
        wins = props.him.totalWins.toString();
    }
    return <Statistics name="Wins" data={wins} />;
};

const Loss = (props: Myprops) => {
    let loss: string = "";
    if (props.him.totalloss === null) {
        loss = "0";
    } else {
        loss = props.him.totalloss.toString();
    }
    return <Statistics name="Defeats" data={loss} />;
};

const TotalMatches = (props: Myprops) => {
    let matches: string = "";
    if (props.him.totalMatches === null) {
        matches = "0";
    } else {
        matches = props.him.totalMatches.toString();
    }
    return <Statistics name="Total battles" data={matches} />;
};

const Level = (props: Myprops) => {
    let lv: string = "";
    if (props.him.level === null) {
        lv = "0";
    } else {
        lv = props.him.level.toString();
    }
    return <Statistics name="Level" data={lv} />;
};

export { Rank, Wins, Loss, TotalMatches, Level };
// export default Rank
