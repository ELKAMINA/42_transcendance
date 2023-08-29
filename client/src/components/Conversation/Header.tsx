import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Box, Stack, Typography, Avatar, Badge, IconButton, Divider, Button, Tooltip } from '@mui/material'

import BlockUser from './BlockUser';
import AdminMenu from '../AdminMenu';
import { blockUnblock } from './Footer';
import ChannelMenu from '../ChannelMenu';
import api from '../../utils/Axios-config/Axios';
import GiveOwnership from '../GiveOwnership';
import { emptyChannel } from '../../data/emptyChannel';
import { UserModel } from '../../types/users/userType';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { ChannelModel } from '../../types/chat/channelTypes';
import { fetchDisplayedChannel , selectDisplayedChannel, selectIsPopupOpen, setIsPopupOpen } from '../../redux-features/chat/channelsSlice';
import { selectCurrentUser } from '../../redux-features/auth/authSlice';
import { FetchActualUser } from '../../redux-features/friendship/friendshipSlice';

const StyledBadge = styled(Badge)(({ theme }) => ({
	"& .MuiBadge-badge": { 
	  backgroundColor: "#44b700",
	  color: "#44b700",
	  boxShadow: `0 0 0 2px ${"white"}`,
	  "&::after": {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		borderRadius: "50%",
		animation: "ripple 1.2s infinite ease-in-out",
		border: "1px solid currentColor",
		content: '""',
		zIndex: 0,
	  },
	},
	"@keyframes ripple": {
	  "0%": {
		transform: "scale(.8)",
		opacity: 1,
	  },
	  "100%": {
		transform: "scale(2.4)",
		opacity: 0,
	  },
	},
  }));

  type HeaderProps = {
	socketRef: React.MutableRefObject<Socket | undefined>;
	onSuggestGame: (gameSuggestionInfos: any) => void;
  };

enum Blockados {
	Member0BlockedMember1,
	Member1BlockedMember0,
	NoOneIsBlocked,
}
  
  
function Header({ socketRef, onSuggestGame }: HeaderProps) {
	const navigate = useNavigate();
	// const dispatch = useAppDispatch();
	const isCreateChannelWindowOpen = useAppSelector(selectIsPopupOpen);
	const currentUser : string = useAppSelector(selectCurrentUser);
	let channelName : string = 'error';
	let channelAvatar : string | undefined = 'error';
	let channel: ChannelModel = useAppSelector(selectDisplayedChannel) || emptyChannel;
	channelName = channel.name;
	const [blockOrUnblock, setBlock] = useState<string>('block')
	const [displayBlockIcon, setDisplayblockIcon] = useState<boolean>(true)
	const [blockStatus, setStatus] = useState<blockUnblock>({
		senderReceiver: {
			sender: "",
			receiver: "",
		},
		status: 0,
	});

	const isPrivateConv : boolean = channel.members?.length === 2 && channel.type === 'privateConv' ? true : false;

	const isOwner : boolean = currentUser === channel.ownedById;
	const isAdmin : boolean = channel.admins.some(admin => admin.login === currentUser) || currentUser === channel.ownedById;
	const dispatch = useAppDispatch();

	useEffect(()=> {
		if (channel.name !== 'empty channel')
			dispatch(fetchDisplayedChannel(channel.name))
	}, [])

	channel = useAppSelector(selectDisplayedChannel) || emptyChannel;

	useEffect(() => {
		if (channel !== emptyChannel){
			// console.log('CurrentUsser', currentUser);
			// console.log('Member 0 ', channel.members[0].login);
			// console.log('Member 1 ', channel.members[1].login);
			const blockingStatus = checkIfUserIsBlocked(currentUser, channel);
			// console.log('Resultat ', blockingStatus);
			if (blockingStatus === Blockados.Member0BlockedMember1){
				if (currentUser === channel.members[0].login){
					// console.log('je rentre ici 1', currentUser);
					setDisplayblockIcon(true)
				}
				else if (currentUser === channel.members[1].login){
					// console.log('je rentre ici 2', currentUser);
					setDisplayblockIcon(false)
				}
			}
			else if (blockingStatus === Blockados.Member1BlockedMember0){
				if (currentUser === channel.members[0].login){
					// console.log('je rentre ici 3', currentUser);
					setDisplayblockIcon(false)
				}
				else if (currentUser === channel.members[1].login){
					// console.log('je rentre ici 4', currentUser);
					setDisplayblockIcon(true)
				}
			}
			else setDisplayblockIcon(true)
		}
	}, [channelName])
	// if the conversation is private, 
	// the name of the channel should be the name of 
	// the channel member that is not the current user

	if (isPrivateConv) {
		if (channel.members[0].login === currentUser) {
			channelName = channel.members[1].login;
			channelAvatar = channel.members[1].avatar
		}
		else {
			channelName = channel.members[0].login;
			channelAvatar = channel.members[0].avatar;
		}
	} else {
		channelName = channel.name;
		channelAvatar = channel.avatar;
	}

	const [openBlock, setOpenBlock] = useState<boolean>(false);

	const handleCloseBlock = () => {
		setOpenBlock(false);
	}

	const handleProfile = async (name: string) => {
		await api
		.get('http://localhost:4001/user/userprofile', {
				params: {
						ProfileName: name,
					}
				})
		.then((res) => {
			navigate(`/userprofile?data`, { state: { data: res.data } })
		})
		.catch((e) => {
			console.log('ERROR from request with params ', e)
		})
	}

	const checkIfUserIsBlocked = (currentUser: string, channel: ChannelModel ) => {
		let check;

		if (channel.members.length < 2)
			return ;

		// console.log('FROM CHECK FUNCTION Member 0 ', channel.members[0].login);
		// console.log('FROM CHECK FUNCTION Member 1 ', channel.members[1].login);
		if (channel.members.length <= 1)
			return ; // added by alicia
		if (currentUser === channel.members[0].login){
			check = channel.members[0].blockedBy.find((e: UserModel) => e.login === channel.members[1].login)
			// console.log('MEMBERS 0 blockedBy friends ', channel.members[0].blocked)
			// console.log('Here check ', check)
			// console.log('FROM CHECK FUNCTION --CHECK 1', check);
			if (check){
				return Blockados.Member1BlockedMember0;
			}
			check = channel.members[0].blocked.find((e: UserModel) => e.login === channel.members[1].login)
			// console.log('MEMBERS 0 blocked friends ', channel.members[0].blocked)
			// console.log('Here check ', check)
			if (check){

				return Blockados.Member0BlockedMember1;
			}
		}
		else {
			check = channel.members[1].blockedBy.find((e: UserModel) => e.login === channel.members[0].login)
			// console.log('FROM CHECK FUNCTION --CHECK 2', check);
			// console.log('MEMBERS 1 blockedBy friends ', channel.members[0].blocked)
			// console.log('Here check ', check)
			if (check){
				return Blockados.Member0BlockedMember1;
			}
			check = channel.members[1].blocked.find((e: UserModel) => e.login === channel.members[0].login)
			// console.log('MEMBERS 1 blocked friends ', channel.members[1].blocked)
			// console.log('Here check ', check)
			if (check){
				// console.log('Here check ', Blockados.Member1BlockedMember0)
				return Blockados.Member1BlockedMember0;
			}

		}
		return Blockados.NoOneIsBlocked;
	}

	const handleBlockingUnblocking = () => {
		socketRef.current?.emit('blockOrUnblockUser', {sender: currentUser, receiver: currentUser === channel.members[0].login ? channel.members[1].login : channel.members[0].login, channelName: channel.name })
		setOpenBlock(true);
	}
	
	socketRef.current?.off('blockStatus').on('blockStatus', (status: string) => { // DEBUB : replace .off by useEffect
		setBlock(status);
	})

	socketRef.current?.off('FriendBlocked').on('FriendBlocked', async (info: blockUnblock) => {
		dispatch(FetchActualUser());
		if (info.status === 1){
			if (info.senderReceiver.receiver === currentUser){
				setDisplayblockIcon(false)
			}
		}
		else {
			if (info.senderReceiver.receiver === currentUser){
				setDisplayblockIcon(true)
			}
		}
	})
	
	useEffect(() => {
		dispatch(setIsPopupOpen(false));
	}, []) // reset isCreateChannelWindowOpen if refresh
		
	return (
		<Box 
			p={2}
			sx={{
				width: '100%',
				backgroundColor: '#F8FAFF',
				boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)',
			}}
		>
			<Stack alignItems={'center'} direction={'row'} justifyContent={'space-between'} sx={{width: '100%', height: '100%',}}>
				<Stack direction={'row'} spacing={2}>
					<Box>
						{!isCreateChannelWindowOpen && <StyledBadge>
							<Button 
								onClick={() => handleProfile(channelName)}
								disabled={channel.type !== 'privateConv'}
							>
							<Avatar
								alt={channelName}
								src={channelAvatar}
								sx={{ bgcolor: '#fcba03' }}
							/>
							</Button>
						</StyledBadge>}
					</Box>
					<Stack spacing={1}>
							<Typography variant="subtitle2">{channelName}</Typography>
							<Typography color="#595343" variant="caption">{channel.type}</Typography>
					</Stack>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} spacing={3}>
					{isPrivateConv  && !isCreateChannelWindowOpen && 
						<IconButton sx={{color: '#07457E'}} 
							onClick={() => onSuggestGame({
								from: currentUser,
								to: channel.members[0].login === currentUser ? channel.members[1].login: channel.members[0].login,
							})}>
							<SportsEsportsIcon />
						</IconButton>}
					{isPrivateConv &&  displayBlockIcon && !isCreateChannelWindowOpen && 
						<Tooltip title='block user'>
							<IconButton sx={{color: '#4DC8BC'}} onClick= {handleBlockingUnblocking}>
								<RemoveCircleIcon />
							</IconButton>
						</Tooltip>
					}
					{isPrivateConv === false &&
						<Stack direction={'row'} spacing={2}>
							<Divider orientation="vertical" flexItem />
							{!isCreateChannelWindowOpen && <ChannelMenu socketRef={socketRef}/>}
							{isAdmin && !isCreateChannelWindowOpen && <AdminMenu socketRef={socketRef}/>}
							{isOwner && !isCreateChannelWindowOpen && <GiveOwnership />}
						</Stack>
					}
				</Stack>
			</Stack>
			{openBlock && <BlockUser open={openBlock} handleClose={handleCloseBlock} socketRef={socketRef} sender={currentUser} receiver={channel.members[0].login === currentUser ? channel.members[1].login : channel.members[0].login} blocks={blockOrUnblock}/>}
		</Box>
		)
}

export default Header