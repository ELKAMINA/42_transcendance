import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import UserList from './UserList';
import api from '../utils/Axios-config/Axios';
import { UserByLogin, UserModel } from '../types/users/userType';
import { ChannelModel } from '../types/chat/channelTypes';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { fetchDisplayedChannel, fetchUserChannels, selectDisplayedChannel, setAdminUpdate } from '../redux-features/chat/channelsSlice';
import { selectActualUser } from '../redux-features/friendship/friendshipSlice';

export default function ManageAdminDialog({openDialog, setOpenDialog} : {openDialog : boolean, setOpenDialog : (arg0 : boolean) => void}) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const selectedChannel : ChannelModel = useAppSelector((state) => selectDisplayedChannel(state));
	const [updatedAdmins, setUpdatedAdmins] = React.useState<UserByLogin[]>([]);
	const AppDispatch = useAppDispatch();
	const currentUser = useAppSelector(selectActualUser);

	async function updateAdmins() : Promise<void> {
		// just send users as UserByLogin object to prevent 'avatar linked payload too large' error 
		const simplifiedAdmins: UserByLogin[] = updatedAdmins.map(({ login }) => ({ login })); // converting UserModel to UserByLogin to keep only login property
		await api
			.post('http://localhost:4001/channel/updateAdmins', {
				channelName : {name : selectedChannel.name},
				admins : simplifiedAdmins,
			})
			.then((response) => {
				// console.log("response = ", response)
				AppDispatch(setAdminUpdate(true));
				AppDispatch(fetchUserChannels());
				AppDispatch(fetchDisplayedChannel(selectedChannel.name));
			})
			.catch((error) => console.log('error while updating admins : ', error))
	}

	const handleClose = () => {
		updateAdmins();
		setOpenDialog(false);
	};

	const handleCancel = () => {
		setOpenDialog(false);
	};

	// filter the owner from available options because the owner cannot be destituted from its admin status
	// const channelMembersOptions = selectedChannel.members.filter(member => member.login !== selectedChannel.ownedById)
	const channelMembersOptions: UserModel[] = selectedChannel.members.filter((member: UserModel) => {
		// Check if the member is not in the banned array
		const isBanned = selectedChannel.banned.some(banned => banned.login === member.login);
		// if (currentUser.login === selectedChannel.ownedById)
		// 	isBanned = false;
		// Check if the member's login is different from channel.ownedById
		const isOwnedBy = member.login === selectedChannel.ownedById;
	  
		// Return true if the member is not an admin and their login is different from channel.ownedById
		return !isBanned && !isOwnedBy;
	});
	const channelAdminsOptions = selectedChannel.admins.filter(admin => admin.login !== selectedChannel.ownedById)

  	return (
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={openDialog}
				onClose={handleCancel}
				aria-labelledby="manage-admin-dialog"
			>
			<DialogTitle id="manage-admin-dialog">
				{"Manage who has admin rights"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Here you can decide who has administrator privileges.
					An administrator can kick, ban or mute another
					member of the channel, except the other admins. 
				</DialogContentText>
				<UserList usersSet={channelMembersOptions} initialUsers={channelAdminsOptions} setUpdatedUsers={setUpdatedAdmins}/>
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