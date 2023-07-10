import styled from '@emotion/styled';
import { Box, Stack, Typography, Avatar, Badge, IconButton, Divider } from '@mui/material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import BlockUser from './BlockUser';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { selectDisplayedChannel, selectUserChannels } from '../../redux-features/chat/channelsSlice';
import { Channel } from '../../types/chat/channelTypes';
import { emptyChannel } from '../../data/emptyChannel';
import { selectCurrentUser } from '../../redux-features/auth/authSlice';
import { UserDetails } from '../../types/users/userType';

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

const Header = () => {
	const currentUser : string = useAppSelector((state)=> selectCurrentUser(state));
	let channelName : string = 'error';

	const channel: Channel = useAppSelector((state) => selectDisplayedChannel(state)) || emptyChannel;
	const isPrivateConv : boolean = channel.members?.length === 1 && channel.type === 'privateConv' ? true : false;
	
	// if the conversation is private, 
	// the name of the channel should be the name of 
	// the channel member that is not the current user
	if (isPrivateConv) {
		if (channel.members[0].login === currentUser) {
			channelName = channel.createdBy.login; 
		}
		else {
			channelName = channel.members[0].login;
		}
	} else {
		channelName = channel.name;
	}

	const [openBlock, setOpenBlock] = useState<boolean>(false);

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
							<Avatar
								alt={channelName}
								src={channel.avatar}
								sx={{ bgcolor: '#fcba03' }}
							/>
						</StyledBadge>
					</Box>
					<Stack spacing={0.2}>
							<Typography variant="subtitle2">{channelName}</Typography>
							<Typography variant="caption">online</Typography>
					</Stack>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} spacing={3}>
					<IconButton>
						<SportsEsportsIcon />
					</IconButton>
					<IconButton
						onClick={() => {setOpenBlock(true)}}
					>
						<RemoveCircleIcon />
					</IconButton>
					<Divider orientation="vertical" flexItem/>
					<IconButton>
						<ExpandMoreIcon />
					</IconButton>
				</Stack>
			</Stack>
			{openBlock && <BlockUser open={openBlock} handleClose={handleCloseBlock}/>}
		</Box>
		)
}

export default Header
