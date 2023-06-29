import styled from '@emotion/styled';
import { Box, Stack, IconButton, TextField, InputAdornment } from '@mui/material'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { fetchUserChannels, selectDisplayedChannel, selectUserChannels } from '../../redux-features/chat/channelsSlice';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { Channel } from '../../types/chat/channelTypes';
import { ChatMessage } from '../../types/chat/messageType';

const StyledInput = styled(TextField)(({ theme }) => ({
	backgroundColor: 'transparent',
	border: 'none',
	boxShadow: 'none',
	'& .MuiInputBase-input' : {
		paddingTop: '12px',
		paddingBottom: '12px',
		borderRadius: 'none',
		backgroundColor: 'transparent',
		border: 'none',
		boxShadow: 'none',
	}
}))



const Footer = ({ send }: { send: (val: ChatMessage) => void} ) => {

	const [value, setValue] = useState("");
	
	function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
		const input = e.target.value;
		console.log('input = ', input)
		setValue(input);
	}
	
	const authState = useSelector((state : RootState) => state.persistedReducer.auth)
	const displayedChannel: Channel = useAppSelector((state) => selectDisplayedChannel(state));
	console.log('selected channel = ', displayedChannel);

	function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		console.log("sending message !")
		const messageToBeSent = {
			sentBy: authState.nickname,
			sentTo: displayedChannel,
			message: value,
			sentAt: new Date(),
			incoming: true,
			outgoing: false,
			channel: displayedChannel,
		}
		send(messageToBeSent);
	}

	return (
		<Box
			p={2}
			sx={{
				// height: 100,
				width: '100%',
				backgroundColor: '#F8FAFF',
				boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)'
			}}
		>
			<Stack direction={'row'} alignItems={'center'} spacing={3}>
				<StyledInput 
					onChange = {handleChange}
					value = {value}
					variant='filled' fullWidth placeholder="Write a message..." InputProps={{
						disableUnderline: true,
						endAdornment: (
							<InputAdornment position="end">
								<IconButton>
									<SentimentVerySatisfiedIcon />
								</IconButton>
							</InputAdornment>)
				}} />
				<Box sx={{
					height: 48, width: 48, backgroundColor: '#07457E', borderRadius: 1.5
				}}>
					<Stack sx={{height:'100%', width:'100%',}} alignItems={'center'} justifyContent={'center'}>
						<IconButton onClick={handleClick}>
							<SendIcon fontSize="medium" sx={{color: 'white'}}/>
						</IconButton>
					</Stack>
				</Box>
			</Stack>
		</Box>
	)
}

export default Footer
