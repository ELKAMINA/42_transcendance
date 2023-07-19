import { useEffect, useRef } from 'react';
import './chat.css'
import { Box, Stack } from '@mui/material';
import Navbar from '../components/NavBar'; 
import { io } from 'socket.io-client';

import { Provider } from 'react-redux';
import { store } from '../app/store';

import { useAppSelector, useAppDispatch } from '../utils/redux-hooks';
import { FetchActualUser, getActualUser, selectActualUser } from '../redux-features/friendship/friendshipSlice';
import { FetchUserByName } from '../utils/global/global';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { UserPrisma } from '../data/userList';

export const socket = io('http://localhost:4010', {
  withCredentials: true,
  transports: ['websocket'],
  upgrade: false,
  autoConnect: false,
});

function Game () {
	const currentRoute = window.location.pathname;
	const dispatch = useAppDispatch();
	const nickName = useAppSelector(selectCurrentUser);

	dispatch(FetchActualUser())
	let user = useAppSelector(selectActualUser)

	useEffect(() => {
		if (user.status !== 'Playing'){
			socket.connect(); // Will use 'handleConnection' from nestjs/game
			socket.on('connect', () => {
				console.log('I\'m connected');

			});

		}
		return () => {
			if (socket) {
				socket.disconnect();
			}
		}
	}, [])

	useEffect(() => {
		socket.emit("changeStatus", nickName);
		socket.on("statusChanged", (data) => {
			dispatch(getActualUser(data));
			console.log(data);
			socket.emit("joinRoom", nickName);
		});
		socket.on("roomJoined", (newRoom) => {
			console.log('new room id', newRoom);
		})
	}, [nickName])

	return (
		<Provider store={store}>
			<Box>
                <Stack>
				    <Navbar currentRoute={currentRoute} />
                </Stack>
                <Stack>
				    <h1> Looking for your ennemy </h1>
                </Stack>
			</Box>
		</Provider>
	)
}

export default Game;