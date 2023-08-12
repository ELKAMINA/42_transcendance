import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import './Skeleton.css';
import { useAppDispatch, useAppSelector } from '../../../utils/redux-hooks';
import { FetchTotalPlayers, selectTotalPlayers } from '../../../redux-features/game/gameSlice';

interface Myprops {
    name: string,
    data: string,
}

const Statistics = (props: Myprops) => {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch(FetchTotalPlayers());
    }, [dispatch])
    
    const totalPlayers = useAppSelector(selectTotalPlayers);
    return (
        <Card sx={(theme)=> ({
            width: {
                xs: 60,
                sm: 110,
                md: 150,
                lg: 200,
            },
            height: {
                xs: 60,
                sm: 110,
                md: 150,
                lg: 200,
            },
            // overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            // margin: 1,
            alignItems: 'center',
            })
        }>
            <CardContent sx={{
                alignContent: 'center',
            }}>
                <Typography sx={(theme)=> ({
                    fontSize: {
                        xs: 8,
                        sm: 10,
                        md: 20,
                        lg: 30,
                    },
                    color: '#07457E'
                    })
                } 
                 component="div" color="text.secondary" gutterBottom>
                    {props.name}
                </Typography>
                <Typography variant="h3" component="div" sx={(theme)=> ({
                    display: 'flex',
                    flexDirection:'column',
                    alignItems: 'center',
                    fontSize: {
                        xs: 8,
                        sm: 10,
                        md: 80,
                        lg: 200,
                    },
                    color: '#07457E'
                    })}>
                    {props.data}
                    {props.name === 'Rank' && <div className= 'statistics-outof'> out of {totalPlayers}</div>}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Statistics;




