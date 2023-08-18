import styled from '@emotion/styled';
import * as React from 'react';
import { Socket } from 'socket.io-client';
import { Box, Stack, IconButton, TextField, InputAdornment } from '@mui/material'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { fetchDisplayedChannel, selectDisplayedChannel, selectIsMuted, setIsMuted } from '../../redux-features/chat/channelsSlice';
import { selectCurrentUser } from '../../redux-features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { ChannelModel } from '../../types/chat/channelTypes';
import { ChatMessage } from '../../types/chat/messageType';
import { FetchUserByName } from '../../utils/global/global';
import MicOffIcon from '@mui/icons-material/MicOff';

import './Footer.css';

// import { FetchUserByName } from '../../redux-features/friendship/friendshipSlice';
interface mutes {
	login: string,
	ExpiryTime: Date | null,
}

interface mutedInfos {
	mutedUser: mutes[],
	channelName: string,
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
	let isMuted: boolean | undefined;
	const [plusShut, setPlusShut] = useState<number>(0);
	const appDispatch = useAppDispatch();
	
	// record message
	const authState = useSelector((state : RootState) => state.persistedReducer.auth)
	const selectedChannel: ChannelModel = useAppSelector(selectDisplayedChannel);
	
	const isMutedRedux = useAppSelector(selectIsMuted)

	useEffect(() => {
		if (isMutedRedux !== null || isMutedRedux !== undefined){
			isMuted = isMutedRedux.find(el => el.channelName === selectedChannel.name)?.muted;
		}
	}, [selectedChannel])
	
	// console.log("is Muted ", isMuted)

	function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
		const input = e.target.value;
		setValue(input);
	}

	React.useEffect(() => {
        setBlockMsg('')
    }, [selectedChannel])

	// React.useEffect(() => {
	// 	return ()=> {
	// 		appDispatch(setIsMuted(false))
	// 	}
	// })

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

	async function userIsMuted(infos: mutedInfos, muting: boolean) : Promise<boolean> {
		// console.log('selected channel ', selectedChannel)
		if (selectedChannel.type !== 'PrivateConv') {
			try {
				// get most recent selectedChannel version from db
				console.log('ici... ');

				if (selectedChannel.name !== 'empty channel')
					await appDispatch(fetchDisplayedChannel(selectedChannel.name));
			/* ====== Amina adds ===== 
				Here i check if the actual user exists in the array "muted users " of the room. If so, we toggle the isMuted state
			*/
				// if (selectedChannel.name === infos.channelName) {
					console.log('infos ', infos);
					infos.mutedUser.map((user) => {
						if (user.login === currentUser) {
							const newInfos = {channelName: selectedChannel.name, muted: muting}
							appDispatch(setIsMuted(newInfos));
							return true;
						}
							return false;
						}
						)
					return true;
				// }
				// else
				// 	return false;
			}
			catch (error : any) {
				console.log('error while checking if user is muted = ', error);
				return false;
			}
		} else {
			return false;
		}
	}

	/* ====== Amina adds ===== 
		In this component, i added a props which is the socket related to chat
		When an admin is muting members, he emits an event to the room (for all members to be informed) sending the muted memebers and the name of the room
		All the members are listening to the event (userHasBeenMuted), individually, and when it's trigerred,
		the "userIsmuted" function, to see if the currentUser is actually concerned. That's why i changed the prototype of the function, adding to it the args "infos" which is containing (the roomId and the users muted in the room)
	*/
	// socketRef.current?.off('userHasBeenMuted').on('userHasBeenMuted', async (infos: mutedInfos) => {
	// 	await userIsMuted(infos, true);

	// })
	socketRef.current?.on('newShut', async (shutValue: number) => {
		setPlusShut(shutValue)
	})
	
	// const [lessShut, setLessShut] = useState<number>(plusShut);
	
	socketRef.current?.off('userHasBeenMuted').on('userHasBeenMuted', async (infos: mutedInfos) => {
		console.log('Awouuu')
		await userIsMuted(infos, true);
	})
	// useEffect(() => {
	// 	console.log('plusShut ', plusShut)
	// }, [plusShut])

	socketRef.current?.off('UserUnmutedAfterExpiry').on('UserUnmutedAfterExpiry', async (infos: mutedInfos) => {
		console.log('After expiry ', infos);
		await userIsMuted(infos, false);

	})


	async function sendMessage() {
		if (await userIsBlocked() === false && ((isMuted === false || isMuted === undefined) && value !== "")) {
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
	// console.log("is Muted ", isMuted)
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
						{(isMuted === false || isMuted === undefined) && 
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
