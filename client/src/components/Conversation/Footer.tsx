import styled from '@emotion/styled';
import * as React from 'react';
import { Socket } from 'socket.io-client';
import { Box, Stack, IconButton, TextField, InputAdornment } from '@mui/material'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { fetchDisplayedChannel, fetchPublicChannels, fetchUserChannels, selectDisplayedChannel } from '../../redux-features/chat/channelsSlice';
import { selectCurrentUser } from '../../redux-features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { ChannelModel } from '../../types/chat/channelTypes';
import { ChatMessage } from '../../types/chat/messageType';
import { FetchUserByName } from '../../utils/global/global';
import MicOffIcon from '@mui/icons-material/MicOff';

import './Footer.css';
import UnblockBlock from './UnblockBlock';

/** ISSUE 110***/
import { DoNotDisturbOnRounded } from '@mui/icons-material';
import api from '../../utils/Axios-config/Axios';

interface mutes {
	login: string,
	ExpiryTime: Date | null,
}
// import { FetchUserByName } from '../../redux-features/friendship/friendshipSlice';
interface mutedInfos {
	mutedUser: mutes[],
	channelName: string,
}

export interface blockUnblock {
	senderReceiver: {
		sender: string,
		receiver: string,
	},
	status: number,
}

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



const Footer = ({ send, socketRef }: { send: (val: ChatMessage) => void, socketRef : React.MutableRefObject<Socket | undefined>} ) => {
	const currentUser = useAppSelector(selectCurrentUser)
	const blockRef = React.useRef<HTMLInputElement>(null)
	const [blockMsg, setBlockMsg] = React.useState('')
	const [value, setValue] = useState("");
	const [isMuted, setIsMuted] = useState<boolean>(false);
	const appDispatch = useAppDispatch();
	const [blockStatus, setStatus] = useState<blockUnblock>({
		senderReceiver: {
			sender: "",
			receiver: "",
		},
		status: 0,
	});
	const [openBlock, setOpenBlock] = useState<boolean>(false);
	/** ISSUE 110***/
	// HANDLE THE ERROR IN MESSAGE TO DISABLE THE BUTTON IF
	// THE MESSAGE IS TOO LARGE
	const [errorInMsg, setErrorInMsg] = useState<boolean>(false);
	const [errMsg, setErrMsg] = useState<string>("");
	

	// record message
	const authState = useSelector((state : RootState) => state.persistedReducer.auth)
	const selectedChannel: ChannelModel = useAppSelector(selectDisplayedChannel);

	function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
		const input = e.target.value;
		setValue(input);
	}

	React.useEffect( () => {
		setBlockMsg('')
		if (selectedChannel && selectedChannel.type !== 'PrivateConv') {
			if (selectedChannel.name !== 'empty channel')
			// check its muted property array to see if currentUser is in it
			if (selectedChannel.muted.map((user) => {
				if (user.login === currentUser){
					setIsMuted(true);
					return true;
				}
				return false;
			})){
			}
			else
				setIsMuted(false);
		}
		return () => {
			// console.log('jannule le state ', selectedChannel)
			setIsMuted(false);
		}
    }, [selectedChannel])

	/** ISSUE 110***/
	// USE EFFECT TO GET THE LENGTH OF THE INPUT VALUE
	// AND SET THE ERROR MESSAGE
	React.useEffect( () => {
		if (value.length >64) {
			setErrMsg("The messsage is too large (64 characaters max)");
			setErrorInMsg(true);
		}
		else {
			setErrMsg("");
			setErrorInMsg(false);
		}
	}, [value])

	async function userIsBlocked() : Promise<boolean> {
		// console.log('selectedChannel.name = ', selectedChannel.name)
		if (selectedChannel.type === 'privateConv') {
			try {
				let talkingWith : string = '';
				if (selectedChannel.members[0].login === currentUser) {
					talkingWith = selectedChannel.members[1].login;
				}
				else {
					talkingWith = selectedChannel.members[0].login;
				}
				const UserToCheck : any = await FetchUserByName(talkingWith)
				// console.log('userToCheck = ', UserToCheck)

				if (((UserToCheck.blockedBy).find((bl: any) => bl.login === currentUser)) || ((UserToCheck.blocked).find((bl: any) => bl.login === currentUser)) )
				{
					setOpenBlock(true);
					return true;
				}
				else {
					return false;
				}
			}	catch(error : any) {
				console.error('oops, user not found!');
				socketRef.current?.emit('channelDeleted', selectedChannel.name);
				// console.log("selectedChannel.members = ", selectedChannel.members);
				// await api
					// .post('http://localhost:4001/channel/checkChannel', { channelName: selectedChannel.name, channelMembers : selectedChannel.members })
					// .then((response) => {
						// socketRef.current?.emit('channelDeleted', selectedChannel.name);
					// })
					// .catch((error) => console.log('error while deleting channel', error));
				return false; // default return statement
			}
		} else {
			return false;
		} 	
	}

	/* ==== This block of code has been commented by Amina === */
	// async function userIsMuted() : Promise<boolean> {
	// 	if (selectedChannel.type !== 'PrivateConv') {
	// 		try {
	// 			// get most recent selectedChannel version from db
	// 			if (selectedChannel.name !== 'empty channel')
	// 				await appDispatch(fetchDisplayedChannel(selectedChannel.name));
	// 			// check its muted property array to see if currentUser is in it
	// 			if (selectedChannel.muted.some(muted => muted.login === currentUser)){
	// 				return true;
	// 			}
	// 			else
	// 				return false;
	// 		}
	// 		catch (error : any) {
	// 			console.log('error while checking if user is muted = ', error);
	// 			return false;
	// 		}
	// 	} else {
	// 		return false;
	// 	}
	// }

	/* ==== This block of code has been commented by Amina === */
	// useEffect(() => {
	// 	(async () => {
	// 	  const mutedStatus = await userIsMuted();
	// 	  setIsMuted(mutedStatus);
	// 	//   console.log('is muted ? ', mutedStatus);
	// 	})();
	// }, []);

	/* Block added by Amina to handle real time muted users and update of the footer */
	socketRef.current?.on('userHasBeenMuted', async (infos: mutedInfos) => {
		if (infos.mutedUser.length === 0){
			setIsMuted(false);
		}
		else {
			const user = infos.mutedUser.findIndex(user => user.login === currentUser)
			if (user !== -1){
				appDispatch(fetchDisplayedChannel(selectedChannel.name))
				appDispatch(fetchUserChannels())
				appDispatch(fetchPublicChannels())
			}
			else {
				setIsMuted(false)
			}
		}

	})

	socketRef.current?.off('UserUnmutedAfterExpiry').on('UserUnmutedAfterExpiry', async (user: string) => {
		if (user === currentUser){
			appDispatch(fetchDisplayedChannel(selectedChannel.name))
		}
	})

	socketRef.current?.on('FriendBlocked', async (info: blockUnblock) => {
		setStatus(info)
		setOpenBlock(true)
	})


	async function sendMessage() {
		if (await userIsBlocked() === false && isMuted === false && value !== "" &&
						errorInMsg === false) {
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

	const handleCloseBlock = () => {
		setOpenBlock(false);
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
			{openBlock && <UnblockBlock open={openBlock} handleClose={handleCloseBlock} info={blockStatus}/>}
			<Stack direction={'row'} alignItems={'center'} spacing={3}>
				<StyledInput
					onChange = {handleChange}
					onKeyDown= {handleKeyDown}
					error={errorInMsg}
					helperText={errMsg}
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
						{isMuted === false && errorInMsg === false && 
							<IconButton onClick={handleClick} >
								<SendIcon fontSize="medium" sx={{color: 'white'}}/>
							</IconButton>
						}
						{isMuted === true && <MicOffIcon fontSize='medium' sx={{color: 'red'}}/>}
						{isMuted === false && errorInMsg === true && <DoNotDisturbOnRounded fontSize="medium" sx={{color: 'red'}}/>}
					</Stack>
				</Box>
			</Stack>
		</Box>
	)
}

export default Footer