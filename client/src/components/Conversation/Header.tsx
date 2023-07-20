import styled from '@emotion/styled';
import { Box, Stack, Typography, Avatar, Badge, IconButton, Divider, Button, Tooltip } from '@mui/material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useState } from 'react';
import BlockUser from './BlockUser';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { selectDisplayedChannel, } from '../../redux-features/chat/channelsSlice';
import { Channel, ChannelModel } from '../../types/chat/channelTypes';
import { emptyChannel } from '../../data/emptyChannel';
import ChannelMenu from '../ChannelMenu';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/Axios-config/Axios';
import { selectCurrentUser } from '../../redux-features/auth/authSlice';
import { Socket } from 'socket.io-client';
import AdminMenu from '../AdminMenu';
import GiveOwnerShipDialog from '../GiveOwnerShipDialog';
import GiveOwnership from '../GiveOwnership';

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
  };
  
  function Header({ socketRef }: HeaderProps) {
	const navigate = useNavigate();
	const currentUser : string = useAppSelector(selectCurrentUser);
	let channelName : string = 'error';
	let channelAvatar : string | undefined = 'error';

	const channel: ChannelModel = useAppSelector(selectDisplayedChannel) || emptyChannel;
	const isPrivateConv : boolean = channel.members?.length === 1 && channel.type === 'privateConv' ? true : false;

	const isAdmin : boolean = channel.members.some(member => member.login === currentUser) || currentUser === channel.createdById;
	const isOwner : boolean = currentUser === channel.createdById;

	// if the conversation is private, 
	// the name of the channel should be the name of 
	// the channel member that is not the current user
	if (isPrivateConv) {
		if (channel.members[0].login === currentUser) {
			channelName = channel.createdBy.login;
			channelAvatar = channel.createdBy.avatar
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
			const params = new URLSearchParams(res.data).toString()
			navigate(`/userprofile?data=${params}`)})
		.catch((e) => {
			console.log('ERROR from request with params ', e)
		})
	}
	
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
						<StyledBadge
							overlap="circular"
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "right",
							}}
							variant="dot"
						>
							<Button onClick={() => handleProfile(channelName)}>
							<Avatar
								alt={channelName}
								src={channelAvatar}
								sx={{ bgcolor: '#fcba03' }}
							/>
							</Button>
						</StyledBadge>
					</Box>
					<Stack spacing={0.2}>
							<Typography variant="subtitle2">{channelName}</Typography>
							<Typography variant="caption">online</Typography>
					</Stack>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} spacing={3}>
					<IconButton sx={{color: '#07457E'}}>
						<SportsEsportsIcon />
					</IconButton>
					{isPrivateConv &&
						<IconButton onClick={() => {setOpenBlock(true)}}>
							<RemoveCircleIcon />
						</IconButton>
					}
					{!isPrivateConv &&
						<Stack direction={'row'} spacing={2}>
							<Divider orientation="vertical" flexItem />
							<ChannelMenu socketRef={socketRef}/>
							{isAdmin && <AdminMenu socketRef={socketRef}/>}
							{isOwner && <GiveOwnership />}
						</Stack>
					}
				</Stack>
			</Stack>
			{openBlock && <BlockUser open={openBlock} handleClose={handleCloseBlock} socketRef={socketRef} sender={currentUser} receiver={channel.name}/>}
		</Box>
		)
}

export default Header
