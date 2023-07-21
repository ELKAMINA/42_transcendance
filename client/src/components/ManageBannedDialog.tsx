import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import UserList from './UserList';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { fetchDisplayedChannel, fetchUserChannels, selectDisplayedChannel } from '../redux-features/chat/channelsSlice';
import api from '../utils/Axios-config/Axios';
import { Channel, ChannelModel } from '../types/chat/channelTypes';
import { UserByLogin, UserModel } from '../types/users/userType';
import SendIcon from '@mui/icons-material/Send';

export default function ManageBannedDialog({openDialog, setOpenDialog} : {openDialog : boolean, setOpenDialog : (arg0 : boolean) => void}) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const selectedChannel : ChannelModel = useAppSelector((state) => selectDisplayedChannel(state));
	const [updatedBanned, setUpdatedBanned] = React.useState<UserModel[]>([]);
	const AppDispatch = useAppDispatch();

	async function updateBanned() : Promise<void> {
		await api
			.post('http://localhost:4001/channel/updateBanned', {
				channelName : {name : selectedChannel.name},
				banned : updatedBanned,
			})
			.then((response) => {
				// console.log("response = ", response)
				AppDispatch(fetchUserChannels());
				AppDispatch(fetchDisplayedChannel(selectedChannel.name));
			})
			.catch((error) => console.log('error while updating admins : ', error))
	}

	const handleClose = () => {
		updateBanned();
		setOpenDialog(false);
	};

	const handleCancel = () => {
		setOpenDialog(false);
	};

	const membersOptions: UserModel[] = selectedChannel.members.filter((member: UserModel) => {
		// Check if the member is not in the admins array
		const isAdmin = selectedChannel.admins.some(admin => admin.login === member.login);
	  
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
				aria-labelledby="manage-banned-dialog"
			>
			<DialogTitle id="manage-banned-dialog">
				{"Manage who is banned from the channel"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Here you can decide who is banned from the channel. 
				</DialogContentText>
				<UserList usersSet={membersOptions} initialUsers={selectedChannel.banned} setUpdatedUsers={setUpdatedBanned}/>
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