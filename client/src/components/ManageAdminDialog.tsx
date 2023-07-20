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

export default function ManageAdminDialog({openDialog, setOpenDialog} : {openDialog : boolean, setOpenDialog : (arg0 : boolean) => void}) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const selectedChannel : ChannelModel = useAppSelector((state) => selectDisplayedChannel(state));
	const [updatedAdmins, setUpdatedAdmins] = React.useState<UserModel[]>([]);
	const AppDispatch = useAppDispatch();

	async function updateAdmins() : Promise<void> {
		await api
			.post('http://localhost:4001/channel/updateAdmins', {
				channelName : {name : selectedChannel.name},
				admins : updatedAdmins,
			})
			.then((response) => {
				// console.log("response = ", response)
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
				An administrator can kick out, ban or mute another
				member of the channel, except the owner. 
			</DialogContentText>
			<UserList updatedAdmins={updatedAdmins} setUpdatedAdmins={setUpdatedAdmins}/>
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