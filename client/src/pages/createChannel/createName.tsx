import { useDispatch } from "react-redux";
import "./createChannel.css"
import { Box, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { changeChannelName } from "../../redux-features/chat/createChannel/channelNameSlice";
import { Channel } from "../../types/chat/channelTypes";
import { fetchAllChannelsInDatabase, selectAllChannels } from "../../redux-features/chat/channelsSlice";
import { useAppDispatch, useAppSelector } from "../../utils/redux-hooks";

function CreateName() {
	const dispatchSync = useAppDispatch();
	React.useEffect(() => {dispatchSync(fetchAllChannelsInDatabase())}, []);
	const channels : Channel[] = useAppSelector(selectAllChannels);
	
	const [channelName, setChannelName] = useState('');
	const [isTaken, setIsTaken] = useState(false);

	const dispatch = useDispatch();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setChannelName(value);

		if (channels.find(channel => channel.name === value)) {
		  setIsTaken(true);
		} else {
		  dispatch(changeChannelName(value))
		  setIsTaken(false);
		}
	}
	  

	return (
	<Box width={'100%'}>
		<TextField
			type='channelName'
			label='enter channel name'
			variant = 'outlined'
			color = 'success'
			value = {channelName}
			onChange={handleChange}
			required
			helperText={isTaken === true ? 'this name is taken!' : 'required'}
			error={isTaken === true}
			sx={{
				width: '100%',
				'& input': {
					backgroundColor: 'transparent',
					boxShadow: 'none'
				}
			}}
		/>
	</Box>
	);
}

export default CreateName