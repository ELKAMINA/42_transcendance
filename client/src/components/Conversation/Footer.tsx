import styled from '@emotion/styled';
import * as React from 'react';
import { Box, Stack, IconButton, TextField, InputAdornment } from '@mui/material'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { fetchDisplayedChannel, selectDisplayedChannel } from '../../redux-features/chat/channelsSlice';
import { selectCurrentUser } from '../../redux-features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { ChannelModel } from '../../types/chat/channelTypes';
import { ChatMessage } from '../../types/chat/messageType';
import { FetchUserByName } from '../../utils/global/global';
import MicOffIcon from '@mui/icons-material/MicOff';

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
	const currentUser = useAppSelector(selectCurrentUser)
	const blockRef = React.useRef<HTMLInputElement>(null)
	const [blockMsg, setBlockMsg] = React.useState('')
	const [value, setValue] = useState("");
	const [isMuted, setIsMuted] = useState<boolean>(false);
	const appDispatch = useAppDispatch();

	// record message
	const authState = useSelector((state : RootState) => state.persistedReducer.auth)
	const selectedChannel: ChannelModel = useAppSelector(selectDisplayedChannel);

	function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
		const input = e.target.value;
		setValue(input);
	}

	React.useEffect(() => {
        setBlockMsg('')
    }, [selectedChannel])

	async function userIsBlocked() : Promise<boolean> {
		if (selectedChannel.type === 'privateConv') {
			try {
				const UserToCheck : any = await FetchUserByName(selectedChannel.name)
				if (((UserToCheck.blockedBy).find((bl: any) => bl.login === currentUser)) || ((UserToCheck.blocked).find((bl: any) => bl.login === currentUser)) )
				{
					setBlockMsg("Maaaaan, You can't talk to each other. BLOCKED")
					return true;
				}
				else {
					return false;
				}
			}	catch(error : any) {
				console.error('error while checking if user is blocked = ', error);
				return false; // default return statement
			}
		} else {
			return false;
		} 	
	}

	async function userIsMuted() : Promise<boolean> {
		if (selectedChannel.type !== 'PrivateConv') {
			try {
				// get most recent selectedChannel version from db
				await appDispatch(fetchDisplayedChannel(selectedChannel.name));
				// check its muted property array to see if currentUser is in it
				if (selectedChannel.muted.some(muted => muted.login === currentUser))
					return true;
				else
					return false;
			}
			catch (error : any) {
				console.log('error while checking if user is muted = ', error);
				return false;
			}
		} else {
			return false;
		}
	}

	useEffect(() => {
		(async () => {
		  const mutedStatus = await userIsMuted();
		  setIsMuted(mutedStatus);
		  console.log('is muted ? ', mutedStatus);
		})();
	}, []);


	async function sendMessage() {
		if (await userIsBlocked() === false && isMuted === false) {
			const messageToBeSent = {
				sentBy: authState.nickname,
				sentById: authState.nickname,
				senderSocketId: '',
				message: value,
				sentAt: new Date(),
				incoming: true,
				outgoing: false,
				channel: selectedChannel.name,
				channelById: selectedChannel.name,
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

	// console.log('selectedChannel : ', selectedChannel);
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
						{isMuted === false && 
							<IconButton onClick={handleClick}>
								<SendIcon fontSize="medium" sx={{color: 'white'}}/>
							</IconButton>
						}
						{isMuted === true && <MicOffIcon fontSize='medium' sx={{color: 'red'}}/>}
					</Stack>
				</Box>
			</Stack>
		</Box>
	)
}

export default Footer
