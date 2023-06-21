import "./createChannel.css"

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import React from "react";
import CreateName from "./createName";
import CreateUsersList from "./createUsersList";
import CreateType from "./createChannelType";
import { ChannelTypeState } from '../../features/chat/channelTypeSlice';
import { Box, Button, Stack } from "@mui/material";
import { IconButton } from "@mui/material";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

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
			}
		})

		console.log("channel created!")
		props.setTrigger(false);
	}

	function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault(); // Prevents the default form submission behavior

		// Submit the form data
		handleCreateChannel();
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
