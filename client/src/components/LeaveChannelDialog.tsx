import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { fetchDisplayedChannel, fetchUserChannels, selectDisplayedChannel, selectUserChannels } from '../redux-features/chat/channelsSlice';
import api from '../utils/Axios-config/Axios';
import { Channel, ChannelModel } from '../types/chat/channelTypes';
import PasswordField from './PasswordField';
import { FormHelperText, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { Socket } from 'socket.io-client';
import { emptyChannel } from '../data/emptyChannel';

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
	
	async function addMembers() : Promise<void> {
		const updatedMembers = selectedChannel.members.filter((member) => member.login != currentUser)
		// console.log('updatedMembers = ', updatedMembers);

		await api
			.post('http://localhost:4001/channel/replaceMembers', {
				channelName : {name : selectedChannel.name},
				members : updatedMembers,
			})
			.then((response) => {
				// update the state of the user channels
				AppDispatch(fetchUserChannels());

				// update the state of the selected channel
				const channelToDisplay = userChannels.find(channel => channel.key === '');
				if (channelToDisplay)
					AppDispatch(fetchDisplayedChannel(channelToDisplay.name));
				else
					AppDispatch(fetchDisplayedChannel(emptyChannel.name));

				// emit goodbye message
				socketRef.current?.emit('LeavingChannel', {
					sentBy: currentUser,
					message :  `${currentUser} has left the channel!`,
					sentAt: new Date(),
					senderSocketId: socketRef.current.id,
					incoming: true,
					outgoing: false,
					subtype: 'InfoMsg',
					channel: selectedChannel.name,
					channelById: selectedChannel.name,
				});
			})
			.catch((error) => console.log('error while updating members : ', error))
	}

	function handleSubmit() {
		addMembers();
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
				<DialogContentText sx={{marginTop:'7%', marginBottom: '7%'}}>
					Doing this will exclude you from the list of members. If this channel is private, you will only be able to re-join if invited by a member.
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