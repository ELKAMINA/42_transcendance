import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Statistics from './Skeleton';
import { useAppDispatch, useAppSelector } from '../../../utils/redux-hooks';
import { selectTotalPlayers, FetchTotalPlayers } from '../../../redux-features/game/gameSlice';
import { UserPrisma } from '../../../data/userList';
// import { selectTotalPlayers, FetchTotalPlayers, FetchTotalMatchesWon, FetchTotalMatchesLost, FetchTotalPoints } from '../../../redux-features/game/gameSlice';

interface Myprops {
    him: Record<string,string>,
}

const Rank = (props: Myprops) => {
    console.log('props ', props.him.login)
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch(FetchTotalPlayers());
    }, [])
    const totalPlayers = useAppSelector(selectTotalPlayers);
    return (
        <Statistics name="Rank" data={props.him.rank}/>
        // <div> Hello</div>
    )
}

const Wins = (props: Myprops) => {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        // dispatch(FetchTotalMatchesWon());
    }, [])
    // const totalPlayers = useAppSelector(selectTotalPlayers);
    return (
        <Statistics name="Wins" data={props.him.totalWins}/>
    )
}

const Loss = (props: Myprops) => {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        // dispatch(FetchTotalMatchesWon());
    }, [])
    // const totalPlayers = useAppSelector(selectTotalPlayers);
    return (
        <Statistics name="Defeats" data={props.him.totalloss}/>
    )
}

const TotalMatches = (props: Myprops) => {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        // dispatch(FetchTotalMatchesWon());
    }, [])
    // const totalPlayers = useAppSelector(selectTotalPlayers);
    return (
        <Statistics name="Total battles" data={props.him.totalMatches}/>
    )
}

export  {Rank, Wins, Loss, TotalMatches};
// export default Rank