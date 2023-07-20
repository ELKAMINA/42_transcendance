import clsx from 'clsx';
import { store } from '../app/store';
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import Grid from '@mui/material/Grid'; // Grid version 1
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';



import './chat.css'
import Navbar from '../components/NavBar'; 
import { transformData } from './userProfile';
import { UserPrisma } from '../data/userList';
import { FetchUserByName } from '../utils/global/global';
import { updateOpponent, selectOpponent } from '../redux-features/game/gameSlice'
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { useAppSelector, useAppDispatch } from '../utils/redux-hooks';
import { FetchActualUser, getActualUser, selectActualUser } from '../redux-features/friendship/friendshipSlice';
import { useNavigate } from 'react-router-dom';

export const socket = io('http://localhost:4010', {
  withCredentials: true,
  transports: ['websocket'],
  upgrade: false,
  autoConnect: false,
});

const halfGridStyle = {
	height: '100vh',
	background: 'rgba(255, 255, 255, 0.5)',
  };
  
  const waitingGridStyle = {
	height: '100vh',
	backgroundColor: '#AFDBF5',
	color: '#005A9C'
  };

function Matchmaking () {
	const currentRoute = window.location.pathname;
	const dispatch = useAppDispatch();
	const [startingGame, setStarting] = useState(false)
	const nickName = useAppSelector(selectCurrentUser);
	const user = useAppSelector(selectActualUser);
	const navigate = useNavigate()

	
	useEffect(() => {
		if (user.status !== 'Playing'){
			socket.connect(); // Will use 'handleConnection' from nestjs/game
			socket.on('connect', () => {
				console.log('I\'m connected');
				socket.emit("changeStatus", nickName);
			});
			socket.on("statusChanged", (data) => {
				dispatch(FetchActualUser());
				socket.emit("joinRoom", nickName);
			});
			socket.on("waitingForOpponent", () => {
				setStarting(false)
			})
			socket.on("roomJoined", (newRoom) => {
				console.log('new room id', newRoom);
			})
			socket.on("gameBegin", (roomInfo) => {
				dispatch(updateOpponent(roomInfo.opponent))
				setTimeout(()=> {
					navigate('/pong', { state: {roomInfo}})
				}, 5000)
			})
		}
		return () => {

		}
	}, [])

	const opp = useAppSelector(selectOpponent)
	return (
		<>
			<Navbar currentRoute={currentRoute} />
			<Grid container spacing={1} alignItems="center">
				{opp && 
				(<>
					<Grid container sx={{
						backgroundImage: `url(${process.env.PUBLIC_URL + '/thisone.avif'})`,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
						imageRendering: 'auto',
						height: '95vh',
						width: '100wh',
						zIndex: 0,
					}}>
						<Grid item style={halfGridStyle} xs={6} sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
							<Typography variant="h3" sx={{
								color: 'white',
								fontSize: "50px",
								textTransform: 'uppercase',

							}}>{nickName}</Typography>
						</Grid>
						{/* <Typography variant="h3" noWrap>VS</Typography> */}
						<Grid item style={halfGridStyle} xs={6} sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
							<Typography variant="h3" noWrap sx={{
								color: 'white',
								fontSize: "50px",
								textTransform: 'uppercase',
							}}>{opp}</Typography>
						</Grid>
					</Grid>
				</>)
				}
				{!opp && <Grid item xs={12} style={waitingGridStyle} sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
					<Typography variant="h2" noWrap>Waiting for your opponent </Typography>
					<CircularProgress color="primary"/>
				</Grid>}
			</Grid>
		</>
	)
}

function Pong () {
	const currentRoute = window.location.pathname;
	const dispatch = useAppDispatch();
	const nickName = useAppSelector(selectCurrentUser);
	const user = useAppSelector(selectActualUser);
	const location = useLocation();

	const roomInfo = location.state;
	
	useEffect(() => {
		// socket.emit('connectedSocket', {})

		return () => {
			if (socket) {
				socket.disconnect();
				dispatch(updateOpponent(""))
			}
		}
	}, [])

	return (
		<>
			<Navbar currentRoute={currentRoute} />

		</>
	)
}

export {Pong, Matchmaking};