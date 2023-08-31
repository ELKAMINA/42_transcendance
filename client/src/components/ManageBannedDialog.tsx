import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import UserList, { UserWithTime } from './UserList';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { fetchDisplayedChannel, fetchPublicChannels, fetchUserChannels, selectDisplayedChannel, setIsBanned } from '../redux-features/chat/channelsSlice';
import api from '../utils/Axios-config/Axios';
import { ChannelModel } from '../types/chat/channelTypes';
import { UserModel } from '../types/users/userType';
import SendIcon from '@mui/icons-material/Send';
import { selectActualUser } from '../redux-features/friendship/friendshipSlice';

export default function ManageBannedDialog({openDialog, setOpenDialog} : {openDialog : boolean, setOpenDialog : (arg0 : boolean) => void}) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const selectedChannel : ChannelModel = useAppSelector((state) => selectDisplayedChannel(state));
	const currentUser = useAppSelector(selectActualUser);
	const [updatedBanned, setUpdatedBanned] = React.useState<UserModel[]>([]);
	const [updatedBannedWithTime, setUpdatedBannedWithTime] = React.useState<UserWithTime[]>([]);

	const AppDispatch = useAppDispatch();

	function setBannedWithTime() {
		// for all the users in updatedBanned with no time associated,
		// add them to the updatedBannedWithTime with a time set to null
		const updatedBannedWithNullTime = updatedBanned.map(user => {
			// Check if the user already exists in updatedBannedWithTime
			const existingUserIndex = updatedBannedWithTime.findIndex(
			  userTime => userTime.login === user.login
			);
		
			// If the user is not found in updatedBannedWithTime, add it with time set to null
			if (existingUserIndex === -1) {
				return { login: user.login, ExpiryTime: null };
			}
		
			// If the user is found, return the existing entry
			return updatedBannedWithTime[existingUserIndex];
		});

		// send data to backend
		updateBanned(updatedBannedWithNullTime);
	}


	async function updateBanned(readyToBeSendBanned : UserWithTime[]) : Promise<void> {

		// console.log("readyToBeSendBanned = ", readyToBeSendBanned)

		await api
			.post('http://localhost:4001/channel/updateBanned', {
				channelName : {name : selectedChannel.name},
				banned : readyToBeSendBanned,
			})
			.then((response) => {
				// console.log("response = ", response)
				AppDispatch(fetchUserChannels());
				AppDispatch(fetchPublicChannels());
				AppDispatch(fetchDisplayedChannel(selectedChannel.name));
				AppDispatch(setIsBanned(true));
			})
			.catch((error) => console.log('error while updating banned : ', error))
	}

	const handleClose = () => {
		setBannedWithTime();
		setOpenDialog(false);
	};

	const handleCancel = () => {
		setOpenDialog(false);
	};

	const membersOptions: UserModel[] = selectedChannel.members.filter((member: UserModel) => {
		// Check if the member is not in the admins array
		let isAdmin = selectedChannel.admins.some(admin => admin.login === member.login);
		if (currentUser && currentUser.login === selectedChannel.ownedById)
			isAdmin = false;
		// Check if the member's login is different from channel.ownedById
		const isOwnedBy = member.login === selectedChannel.ownedById;
	  
		// Return true if the member is not an admin and their login is different from channel.ownedById
		return !isAdmin && !isOwnedBy;
	}).concat(selectedChannel.banned);

  	return (
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={openDialog}
				onClose={handleCancel}
				aria-labelledby="manage-banned-dialog"
				maxWidth="sm" // Set the maxWidth to "md" for medium width
			>
			<DialogTitle id="manage-banned-dialog">
				{"Manage who is banned from the channel"}
			</DialogTitle>
			<DialogContent
			>
				<DialogContentText
					sx={{
						// backgroundColor: 'red',
						// width: '50%'
						paddingBottom: '3%'
					}}
					
				>
					Here you can decide who is banned from the channel.
					If you set a timer, the user will be banned until 
					[time set by the timer].
					If you don't, he will be banned until manually un-banned.
				</DialogContentText>
				<UserList 
					usersSet={membersOptions} 
					initialUsers={selectedChannel.banned} 
					setUpdatedUsers={setUpdatedBanned}
					setTimer={true}
					setUpdatedUsersWithTime={setUpdatedBannedWithTime}
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