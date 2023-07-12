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

interface Myprops {
    name: string,
    data: string,
}

const MatchHistory = (props: Myprops) => {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
    }, [])
    return (
        <Card sx={{ 
            width: '80vw',
            height: '10vh',
            display: 'flex',
            alignContent: 'center',
            // flexDirection: 'row',
            // justifyContent: 'space-around',
            margin: '20px',
            borderRadius: '20px',
            // alignItems: 'center',
            }}>
            <CardContent sx={{
                display:'flex',
                flexDirection: 'row',
                alignItems: 'center',
                // alignContent: 'center',
                justifyContent: 'space-around',
                flex: '1',
            }}>
                <Typography sx={{ fontSize: 30, color: '00FFFF' }} color="text.secondary" gutterBottom>
                    Player 1
                </Typography> 
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography sx={{ fontSize: 30, color: '#07457E' }} color="text.secondary" gutterBottom>
                        2 - 1
                    </Typography>
                    <Typography sx={{ fontSize: 8, color: '#07457E', font: 'italic' }} color="text.secondary" gutterBottom>
                        30 May
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: 30, color: '00FFFF' }} color="text.secondary" gutterBottom>
                    Player 2
                </Typography>
            </CardContent>
        </Card>
    )
}

export default MatchHistory;




