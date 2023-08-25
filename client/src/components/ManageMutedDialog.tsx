import * as React from 'react';
import { Socket } from 'socket.io-client';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import useMediaQuery from '@mui/material/useMediaQuery';

import UserList, { UserWithTime } from './UserList';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { fetchDisplayedChannel, fetchUserChannels, selectDisplayedChannel } from '../redux-features/chat/channelsSlice';
import api from '../utils/Axios-config/Axios';
import { ChannelModel } from '../types/chat/channelTypes';
import { UserModel } from '../types/users/userType';
import { selectActualUser } from '../redux-features/friendship/friendshipSlice';

export default function ManageMutedDialog({socketRef, openDialog, setOpenDialog} : {openDialog : boolean, setOpenDialog : (arg0 : boolean) => void, socketRef : React.MutableRefObject<Socket | undefined>}) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const selectedChannel : ChannelModel = useAppSelector((state) => selectDisplayedChannel(state));
	const currentUser = useAppSelector(selectActualUser);
	const [updatedMuted, setUpdatedMuted] = React.useState<UserModel[]>([]);
	const [updatedMutedWithTime, setUpdatedMutedWithTime] = React.useState<UserWithTime[]>([]);
	const AppDispatch = useAppDispatch();

	function setMutedWithTime() {
		// for all the users in updatedMuted with no time associated,
		// add them to the updatedMutedWithTime with a time set to null
		const updatedMutedWithNullTime = updatedMuted.map(user => {
			// Check if the user already exists in updatedMutedWithTime
			const existingUserIndex = updatedMutedWithTime.findIndex(
				userTime => userTime.login === user.login
			);

			// If the user is not found in updatedMutedWithTime, add it with time set to null
			if (existingUserIndex === -1) {
				return { login: user.login, ExpiryTime: null };
			}
		
			// If the user is found, return the existing entry
			return updatedMutedWithTime[existingUserIndex];
		});
		
		// console.log('updatedMutedWithNullTime = ', updatedMutedWithNullTime);
		
		// send request to be the backend
		updateMuted(updatedMutedWithNullTime);
	}

	async function updateMuted(readyToBeSendMuted : UserWithTime[]) : Promise<void> {
		await api
			.post('http://localhost:4001/channel/updateMuted', {
				channelName : {name : selectedChannel.name},
				muted : readyToBeSendMuted,
			})
			.then((response) => {
				// console.log('ReadyToBeSendMuted ==== ', readyToBeSendMuted)
				socketRef.current?.emit('userMutedByAdmin', readyToBeSendMuted)
				AppDispatch(fetchUserChannels());
				AppDispatch(fetchDisplayedChannel(selectedChannel.name));
			})
			.catch((error) => console.log('error while updating muted : ', error))
	}

	const handleClose = () => {
		setMutedWithTime();
		setOpenDialog(false);
	};

	const handleCancel = () => {
		setOpenDialog(false);
	};

	React.useEffect(() => {

	})

	const membersOptions: UserModel[] = selectedChannel.members.filter((member: UserModel) => {
		// Check if the member is not in the admins array
		let isAdmin = selectedChannel.admins.some(admin => admin.login === member.login);
		if (currentUser && currentUser.login === selectedChannel.ownedById) // if the currentUser is the owner of the channel, leave the admins in the list
			isAdmin = false;
		// Check if the member's login is different from channel.ownedById
		const isOwnedBy = member.login === selectedChannel.ownedById;
	  
		// Return true if the member is not an admin and their login is different from channel.ownedById
		return !isAdmin && !isOwnedBy;
	});

  	return (
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={openDialog}
				onClose={handleCancel}
				aria-labelledby="manage-muted-dialog"
				maxWidth="sm" // Set the maxWidth to "md" for medium width

			>
			<DialogTitle id="manage-muted-dialog">
				{"Manage who is muted in the channel"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Here you can decide who is muted in the channel.
					A muted member cannot talk in the channel.
					But he is still a member.
					If you set a timer, the user will be muted until 
					[time set by the timer].
					If you don't, he will be muted until manually un-banned.
				</DialogContentText>
				<UserList 
					usersSet={membersOptions} 
					initialUsers={selectedChannel.muted} 
					setUpdatedUsers={setUpdatedMuted} 
					setTimer={true}
					setUpdatedUsersWithTime={setUpdatedMutedWithTime}
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" size='medium' endIcon={<SendIcon />} onClick={handleClose} autoFocus>
					SUBMIT
				</Button>
			</DialogActions>
			</Dialog>
		</div>
	);
}