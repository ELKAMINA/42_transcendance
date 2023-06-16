import { useDispatch, useSelector } from "react-redux";
import "./createChannel.css"
import { RootState } from "../../app/store";
import { TextField } from "@mui/material";
import { useState } from "react";
import { changeChannelName } from "../../features/chat/channelNameSlice";
import { Channel } from "../../data/channelList";

function CreateName() {
	const channels: Channel[] = useSelector((state: RootState) => state.persistedReducer.channels);
	const [channelName, setChannelName] = useState('');
	const [isTaken, setIsTaken] = useState(false);

	const dispatch = useDispatch();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setChannelName(e.target.value);

		if (channels.find(channel => channel.name === channelName)) {
			console.log("channelName taken")
			setIsTaken(true);
		} else {
			console.log("channel name is available!")
			dispatch(changeChannelName(channelName))
		} 
	}

	return (
	<div className='entry1'>
		<label className='form-channel-name' htmlFor='channelName'>channel name</label>
		<br></br>
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
				'& input': {
					backgroundColor: 'transparent',
					boxShadow: 'none'
				}
			}}
		/>
	</div>
	);
}

export default CreateName