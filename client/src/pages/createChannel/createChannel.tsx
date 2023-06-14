import "./createChannel.css"

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import React from "react";
import CreateName from "./createName";
import CreateUsersList from "./createUsersList";
import CreateType from "./createChannelType";
import { ChannelTypeState } from '../../features/chat/channelTypeSlice';
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

interface CreateChannelProps {
	trigger: boolean;
	setTrigger: (value: boolean) => void;
	children?: React.ReactNode;
}
  
function CreateChannel(props : CreateChannelProps) {
	
	const newName = useSelector((state: RootState) => state.channelName);
	const channelUsersList = useSelector((state : RootState) => state.channelUser);
	const channelType = useSelector((state : RootState) => state.channelType) as ChannelTypeState;

	const dispatch = useDispatch();

	function handleCreateChannel() {
		dispatch({
			type: "channels/addChannel",
			payload: {
				name: newName,
				id: Date.now(),
				type: channelType.type,
				protected_by_password: channelType.protected_by_password,
				password: channelType.password,
				userList: channelUsersList
			}
		})
		console.log("channel created!")
		props.setTrigger(false);
	}

	function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault(); // Prevents the default form submission behavior
	  
		// Perform any form validation or processing here
	  
		// Submit the form data
		handleCreateChannel();
	  }

	return (props.trigger) ? (
		<div className='create-channel-popup'>
		<div className='create-channel-popup-inner'>
		<div className="close-button-container">
			<IconButton aria-label='close' size='large' onClick={() => props.setTrigger(false)}>
			<DisabledByDefaultIcon fontSize='large' sx={{ color: '#99E100' }} />
			</IconButton>
		</div>
			<div>
				<form className='create-channel-form' onSubmit={handleFormSubmit}>
					<div className='form-banner'>
						<h1>CREATE CHANNEL</h1>
						<br></br>
					</div>
					<CreateName />
					<br></br>
					<CreateUsersList />
					<br></br>
					<CreateType />
					<div className='entry1'>
						<Button
							type='submit' // will trigger the form submission
							variant='contained'
							size='large'
							sx={{ color: 'white', backgroundColor: '#99E100', fontWeight: '800', fontSize: '2em' }}
						>CREATE CHANNEL
						</Button>
					</div>
				</form>
			</div>
			{props.children}
		</div>
		</div>
	) : null;
}

export default CreateChannel
