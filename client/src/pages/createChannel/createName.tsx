import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Box, TextField } from "@mui/material";

import "./createChannel.css"
import { ChannelModel } from "../../types/chat/channelTypes";
import { useAppDispatch, useAppSelector } from "../../utils/redux-hooks";
import { changeChannelName } from "../../redux-features/chat/createChannel/channelNameSlice";
import { fetchPublicChannels, fetchUserChannels, selectPublicChannels, selectUserChannels } from "../../redux-features/chat/channelsSlice";

/*** ISSUE 110 ***/
// HANDLE ERROR ON WHOLE createChannel COMPONENT
import { setNameErrorState } from "../../redux-features/chat/createChannel/createChannelErrorSlice";

function CreateName() {
	const AppDispatch = useAppDispatch();
	React.useEffect(() => {
		AppDispatch(fetchPublicChannels())
		AppDispatch(fetchUserChannels())
	}, []);

	const publicChannels : ChannelModel[] = useAppSelector(selectPublicChannels);
	const userChannels : ChannelModel[] = useAppSelector(selectUserChannels);
	const channels : ChannelModel[] = [...publicChannels, ...userChannels];

	const [channelName, setChannelName] = useState('');
	const [isTaken, setIsTaken] = useState(false);

	const dispatch = useDispatch();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setChannelName(value);

		if (channels.find(channel => channel.name === value)) {
		  setIsTaken(true);
		  /*** ISSUE 110 ***/
		  dispatch(setNameErrorState(true));
		} else if (value.length <= 0 || value.length > 20) {
			dispatch(setNameErrorState(true));
		} else {
		  dispatch(changeChannelName(value))
		  setIsTaken(false);
		  dispatch(setNameErrorState(false));
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