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

	// record message
	function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
		const input = e.target.value;
		setValue(input);
	}

	const authState = useSelector((state : RootState) => state.persistedReducer.auth)
	const displayedChannel: Channel = useAppSelector((state) => selectDisplayedChannel(state));
	function sendMessage() {
		const messageToBeSent = {
			sentBy: authState.nickname,
			message: value,
			sentAt: new Date(),
			incoming: true,
			outgoing: false,
			channel: displayedChannel.name,
		}
		send(messageToBeSent);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
		  sendMessage();
		}
	}

	// console.log('displayedChannel : ', displayedChannel);
	function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		sendMessage();
		setValue('');
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
					onKeyDown= {handleKeyDown}
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
