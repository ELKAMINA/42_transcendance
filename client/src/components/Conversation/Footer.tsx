import styled from '@emotion/styled';
import * as React from 'react';
import { Box, Stack, IconButton, TextField, InputAdornment } from '@mui/material'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { fetchUserChannels, selectDisplayedChannel, selectUserChannels } from '../../redux-features/chat/channelsSlice';
import { selectCurrentUser } from '../../redux-features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { Channel } from '../../types/chat/channelTypes';
import { ChatMessage } from '../../types/chat/messageType';
import { FetchUserByName } from '../../utils/global/global';
import { transformData } from '../../pages/userProfile';
import Popup from 'reactjs-popup';
import './Footer.css';

// import { FetchUserByName } from '../../redux-features/friendship/friendshipSlice';

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



const Footer = ({ send, }: { send: (val: ChatMessage) => void} ) => {
	const user = useAppSelector(selectCurrentUser)
	const blockRef = React.useRef<HTMLInputElement>(null)
	const [blockMsg, setBlockMsg] = React.useState('')
	const dispatch = useAppDispatch()
	const [value, setValue] = useState("");

	// record message
	const authState = useSelector((state : RootState) => state.persistedReducer.auth)
	const displayedChannel: Channel = useAppSelector((state) => selectDisplayedChannel(state));
	function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
		const input = e.target.value;
		setValue(input);
	}

	React.useEffect(() => {
        setBlockMsg('')
    }, [displayedChannel])

	async function sendMessage() {
		let UserToCheck: any;
		let UserToSee: any;
		if (displayedChannel.type === 'privateConv'){
			// console.log('To whom we want to speak ', displayedChannel.name);
			// console.log("the current user is = ", user)
			// console.log(`${user} sends a message to ${displayedChannel.name}`)
			try {
				UserToCheck = await FetchUserByName(displayedChannel.name)
			}
			catch {
			}

		}
		if (((UserToCheck.blockedBy).find((bl: any) => bl.login === user)) || ((UserToCheck.blocked).find((bl: any) => bl.login === user)) )
		{
			console.log("NOOOOOO je peux pas envoyer message ")
			setBlockMsg("Maaaaan, You can't talk to each other. BLOCKED")
			return ;
		}
		else {
			const messageToBeSent = {
				sentBy: authState.nickname,
				sentById: authState.nickname,
				senderSocketId: '',
				message: value,
				sentAt: new Date(),
				incoming: true,
				outgoing: false,
				channel: displayedChannel.name,
				channelById: displayedChannel.name,
			}
			send(messageToBeSent);
		}

	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			sendMessage();
			setValue('');
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
				<div 
					// trigger={<div>TFA</div>}
					ref={blockRef} className={blockMsg ? "blockmsg" : "offscreen"} 
						aria-live="assertive"
				>
					{blockMsg}
				</div>
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
