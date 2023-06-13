import "./createChannel.css"

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import React from "react";
import CreateName from "./createName";
import CreateUsersList from "./createUsersList";
import CreateType from "./createChannelType";
import { ChannelTypeState } from '../../features/chat/channelTypeSlice';

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

	// dispatch({
		// type: "channeType/addChannelType",
		// payload: {type: e.target.name}
	// })

	function handleCreateChannel() {
		dispatch({
			type: "channel/addChannel",
			payload: {
				name: newName,
				id: Date.now(),
				type: channelType.type,
				protected_by_password: channelType.protected_by_password,
				password: channelType.password,
				userList: channelUsersList
			}
		})
		props.setTrigger(false);
	}

	return (props.trigger) ? (
		<div className='create-channel-popup'>
		<div className='create-channel-popup-inner'>
			<button className='close-btn' onClick={() => props.setTrigger(false)}>close</button>
			<div>
				<form className='create-channel-form'>
					<div className='form-banner'>
						<h1>CREATE CHANNEL</h1>
						<br></br>
					</div>
					<CreateName />
					<br></br>
					<CreateUsersList />
					<CreateType />
					<div className='entry1'>
						<button
							className='createChannelButton'
							onClick={handleCreateChannel}>CREATE CHANNEL
						</button>
					</div>
				</form>
			</div>
			{props.children}
		</div>
		</div>
	) : null;
}

export default CreateChannel
