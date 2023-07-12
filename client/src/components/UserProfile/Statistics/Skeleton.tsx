import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../../utils/redux-hooks';
import { FetchTotalPlayers, selectTotalPlayers } from '../../../redux-features/game/gameSlice';
import { useEffect } from 'react';
import './Skeleton.css';

interface Myprops {
    name: string,
    data: string,
}

const Statistics = (props: Myprops) => {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch(FetchTotalPlayers());
    }, [])
    const totalPlayers = useAppSelector(selectTotalPlayers);
    return (
        <Card sx={{ 
            width: '200px',
            height: '200px',
            display: 'flex',
            justifyContent: 'center',
            margin: '20px',
            alignItems: 'center',
            }}>
            <CardContent sx={{
                alignContent: 'center',
            }}>
            <Typography sx={{ fontSize: 30, color: '#07457E' }} color="text.secondary" gutterBottom>
                {props.name}
            </Typography>
            <Typography variant="h3" component="div" sx={{
                display: 'flex',
                flexDirection:'column',
                alignItems: 'center',
            }}>
                {props.data}
                {props.name === 'Rank' && <h6 className= 'statistics-outof'> out of {totalPlayers}</h6>}
            </Typography>
            </CardContent>
        </Card>
    )
}

export default Statistics;




