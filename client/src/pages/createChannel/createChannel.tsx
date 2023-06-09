import "./createChannel.css"

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import React, { useEffect } from "react";
import CreateName from "./createName";
import CreateUsersList from "./createUsersList";
import CreateType from "./createChannelType";
import { ChannelTypeState, resetChannelType } from '../../redux-features/chat/createChannel/channelTypeSlice';
import { Box, Button, Stack } from "@mui/material";
import { IconButton } from "@mui/material";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
// import { ChatHistory_1 } from "../../data/chatHistory";
import api from '../../utils/Axios-config/Axios' 
import { resetChannelName } from "../../redux-features/chat/createChannel/channelNameSlice";
import { resetChannelUser } from "../../redux-features/chat/createChannel/channelUserSlice";
import bugsBunny from '../../assets/profile_pictures/bugs-carrot.jpg'
import { io } from "socket.io-client";
import { useAppDispatch } from "../../utils/redux-hooks";
import { fetchUserChannels } from "../../redux-features/chat/channelsSlice";
import { UserDetails } from "../../types/users/userType";

interface CreateChannelProps {
	trigger: boolean;
	setTrigger: (value: boolean) => void;
	children?: React.ReactNode;
}
  
function CreateChannel(props : CreateChannelProps) {
	
	const newName = useSelector((state: RootState) => state.persistedReducer.channelName);
	const channelUsersList = useSelector((state : RootState) => state.persistedReducer.channelUser);
	const channelType = useSelector((state : RootState) => state.persistedReducer.channelType) as ChannelTypeState;
	const currentUser = useSelector((state : RootState) => state.persistedReducer.auth);
	const dispatch = useDispatch();
	const appDispatch = useAppDispatch();

	const dummyMessage = {
		sentBy: 'casper',
		sentTo: 'bugs bunny',
		message: 'quoi dneuf docteur',
		sentAt: new Date(),
		img: bugsBunny,
		incoming: false,
		outgoing: true,
		channel: newName,
	}

	const channelCreation = async () => {
		
		const createdBy : UserDetails = {
			login : currentUser.nickname, 
			displayName : currentUser.nickname, 
			email: 'dumdum@dum.dum', 
			avatar : ''
		};

		await api
		.post ('http://localhost:4001/channel/creation', {
			name: newName,
			channelId: Date.now(),
			type: channelType.type,
			createdBy: createdBy,
			admins: [createdBy],
			protected_by_password: channelType.protected_by_password,
			key: channelType.key,
			members: channelUsersList,
			avatar: currentUser.avatar,
			chatHistory: [dummyMessage],
		})
		.then ((response) => {
			// console.log('this channel has been added to the database = ', response);
			appDispatch(fetchUserChannels());
			dispatch(resetChannelName());
			dispatch(resetChannelType());
			dispatch(resetChannelUser());
		})
		.catch ((error) => {
			console.log('error = ', error);
		})
	}

	function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault(); // Prevents the default form submission behavior

		// console.log('login = ', newName)
		// console.log('type = ', channelType.type)
		// console.log('owner = ', authState.nickname)
		// console.log('protected_by_pwd = ', channelType.protected_by_password)
		// console.log('password = ', channelType.key)
		// console.log('userList = ', channelUsersList)
		// console.log('avatar = ', authState.avatar)

		// Submit the form data
		channelCreation();
		props.setTrigger(false);
	}


	function handleCancelFormSubmit() {
		dispatch(resetChannelType());
		dispatch(resetChannelName());
		dispatch(resetChannelUser());
		props.setTrigger(false);
	}
	
	return (props.trigger) ? (
		<Box className='create-channel-popup'>
			<Stack spacing={2} className='create-channel-popup-inner'>
				<Box className="close-button-container">
					<IconButton aria-label='close' size='large' onClick={handleCancelFormSubmit}>
						<DisabledByDefaultIcon fontSize='small' sx={{ color: '#99E100' }} />
					</IconButton>
				</Box>
				<Box>
					<form className='create-channel-form' onSubmit={handleFormSubmit}>
						<Stack spacing={2} direction={"column"}>
							<Box className='form-banner'>
								<h1>CREATE CHANNEL</h1>
								<br></br>
							</Box>
							<CreateName />
							<CreateUsersList />
							<CreateType />
							<Box>
								<Button
									type='submit' // will trigger the form submission
									variant='contained'
									// size='large'
									sx={{ color: 'white', backgroundColor: '#99E100', fontWeight: '800', fontSize: '2em' }}
								>CREATE CHANNEL
								</Button>
							</Box>
						</Stack>
					</form>
				</Box>
				{props.children}
			</Stack>
		</Box>
	) : null;
}

export default CreateChannel
