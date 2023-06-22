import { useDispatch, useSelector } from "react-redux";
import "./createChannel.css"
import { RootState } from "../../app/store";
import { Box, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { changeChannelName } from "../../redux-features/chat/createChannel/channelNameSlice";
import { Channel } from "../../types/chat/chatTypes";

function CreateName() {
	const channels: Channel[] = useSelector((state: RootState) => state.persistedReducer.channels);
	const [channelName, setChannelName] = useState('');
	const [isTaken, setIsTaken] = useState(false);

	const dispatch = useDispatch();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setChannelName(value);
		console.log(value);
		if (channels.find(channel => channel.login === value)) {
		  console.log("channelName taken")
		  setIsTaken(true);
		} else {
		  console.log("channel name is available!")
		  dispatch(changeChannelName(value))
		  setIsTaken(false);
		} 
	}
	  

	return (
	<Box>
		<Stack alignItems={'center'} direction={'column'} spacing={1}>
			<label className='form-channel-name' htmlFor='channelName'></label>
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
		</Stack>
	</Box>
	);
}

export default CreateName