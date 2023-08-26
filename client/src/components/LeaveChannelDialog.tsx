import React from 'react'
import { Socket } from 'socket.io-client';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContentText from '@mui/material/DialogContentText';

import api from '../utils/Axios-config/Axios';
import { emptyChannel } from '../data/emptyChannel';
import { ChannelModel } from '../types/chat/channelTypes';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { fetchDisplayedChannel, fetchPublicChannels, fetchUserChannels, selectDisplayedChannel, selectUserChannels } from '../redux-features/chat/channelsSlice';

export type LeaveChannelDialogProps = {
	socketRef: React.MutableRefObject<Socket | undefined>,
	openDialog : boolean, 
	setOpenDialog : (arg0 : boolean) => void
}

export default function LeaveChannelDialog({socketRef, openDialog, setOpenDialog} : LeaveChannelDialogProps) {

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const selectedChannel : ChannelModel = useAppSelector(selectDisplayedChannel);
	const userChannels : ChannelModel[] = useAppSelector(selectUserChannels);

	const currentUser : string = useAppSelector(selectCurrentUser);
	const AppDispatch = useAppDispatch();
	
	async function updateMembers() : Promise<void> {
		const updatedMembers = selectedChannel.members.filter((member) => member.login !== currentUser)
		// console.log('updatedMembers = ', updatedMembers);

		await api
			.post('http://localhost:4001/channel/replaceMembers', {
				channelName : {name : selectedChannel.name},
				members : updatedMembers,
				action: 'leave',
				tokickOrLeave: [],
			})
			.then((response) => {
				// AppDispatch(set(true));
				AppDispatch(fetchUserChannels());
				AppDispatch(fetchDisplayedChannel('WelcomeChannel'));
				AppDispatch(fetchPublicChannels());
				// emit goodbye message
				socketRef.current?.emit('LeavingChannel', {
					sentBy: currentUser,
					message :  `${currentUser} has left the channel!`,
					sentAt: new Date(),
					senderSocketId: socketRef.current.id,
					incoming: true,
					outgoing: false,
					subtype: 'infoMsg',
					channel: selectedChannel.name,
					channelById: selectedChannel.name,
				});
			})
			.catch((error) => console.log('error while updating members from LeaveChannelDialog: ', error))
	}

	function handleSubmit() {
		updateMembers();
		setOpenDialog(false);
	}

	function handleCancel() {
		setOpenDialog(false);
	}

	return (
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={openDialog}
				// onClose={handleCancel}
				aria-labelledby="manage-password"
			>
			<DialogTitle id="manage-password">
				{"Leaving channel"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{marginTop:'7%'}}>
					Doing this will exclude you from the list of members. 
					If this channel is private, you will only be able to re-join if invited by a member.
				</DialogContentText>
				<DialogContentText sx={{fontWeight: 'bold'}}>
					If you are an admin of the channel, you will loose this status.
				</DialogContentText>
				<DialogContentText sx={{marginBottom: '7%'}}>
					Are you sure you want to leave?
				</DialogContentText>
			</DialogContent>
			<DialogActions
				sx={{
					display: 'flex',
					justifyContent: 'end', // This centers the content horizontally
				}}
			>
				<Button variant="outlined" size='medium' onClick={handleCancel} autoFocus>
					NO, I WANT TO STAY
				</Button>
				<Button variant="contained" size='medium' onClick={handleSubmit} autoFocus>
					YES, I'D LIKE TO LEAVE
				</Button>
			</DialogActions>
			</Dialog>
		</div>
	);
}