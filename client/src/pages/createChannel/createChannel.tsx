import "./createChannel.css"

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import React from "react";
import CreateName from "./createName";
import CreateUsersList from "./createUsersList";
import CreateType from "./createChannelType";
import { ChannelTypeState } from '../../redux-features/chat/createChannel/channelTypeSlice';
import { Box, Button, Stack } from "@mui/material";
import { IconButton } from "@mui/material";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
// import { ChatHistory_1 } from "../../data/chatHistory";
import api from '../../utils/Axios-config/Axios' 

interface CreateChannelProps {
	trigger: boolean;
	setTrigger: (value: boolean) => void;
	children?: React.ReactNode;
}
  
function CreateChannel(props : CreateChannelProps) {
	
	const newName = useSelector((state: RootState) => state.persistedReducer.channelName);
	const channelUsersList = useSelector((state : RootState) => state.persistedReducer.channelUser);
	const channelType = useSelector((state : RootState) => state.persistedReducer.channelType) as ChannelTypeState;
	const authState = useSelector((state : RootState) => state.persistedReducer.auth)

	const dispatch = useDispatch();

	const channelCreation = async () => {
		await api
		.post ('http://localhost:4001/channel/creation', {
			login: newName,
			id: Date.now(),
			type: channelType.type,
			owner: authState.nickname, 
			protected_by_password: channelType.protected_by_password,
			password: channelType.password,
			userList: channelUsersList,
			avatar: authState.avatar,
			// chatHistory: ChatHistory_1,
		})
		.then ((response) => {
			console.log('response = ', response);
		})
		.catch ((error) => {
			console.log('error = ', error);
		})
	}

	function handleCreateChannel() {
		dispatch({
			type: "channels/addChannel",
			payload: {
				login: newName,
				id: Date.now(),
				type: channelType.type,
				owner: authState.nickname, 
				protected_by_password: channelType.protected_by_password,
				password: channelType.password,
				userList: channelUsersList,
				avatar: authState.avatar,
				chatHistory: [],
			}
		})

		console.log("channel created!")
		props.setTrigger(false);
	}

	function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault(); // Prevents the default form submission behavior

		// Submit the form data
		handleCreateChannel();
		channelCreation();
	  }
	
	return (props.trigger) ? (
		<Box className='create-channel-popup'>
			<Stack spacing={2} className='create-channel-popup-inner'>
				<Box className="close-button-container">
					<IconButton aria-label='close' size='large' onClick={() => props.setTrigger(false)}>
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
