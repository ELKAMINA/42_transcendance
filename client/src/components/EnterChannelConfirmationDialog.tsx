import { Link } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import api from '../utils/Axios-config/Axios';
import { Channel } from '../types/chat/channelTypes';
import { UserByLogin } from '../types/users/userType';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { useAppDispatch, useAppSelector, } from '../utils/redux-hooks';
import { fetchDisplayedChannel, fetchUserChannels } from '../redux-features/chat/channelsSlice';

export type EnterChannelConfirmationDialogProps = {
	selectedChannel : Channel | undefined;
	openDialog : boolean;
	setOpenDialog : (arg0 : boolean) => void;
	setIsConfirmed : (isConfirmed : boolean) => void;
}

export default function EnterChannelConfirmationDialog({
	setIsConfirmed,
	selectedChannel,
	openDialog, 
	setOpenDialog } : EnterChannelConfirmationDialogProps) {
	
	const AppDispatch = useAppDispatch();
	const currentUser : string = useAppSelector(selectCurrentUser);

	async function addMembers() : Promise<void> {
		const newMember : UserByLogin = {login : currentUser};
		await api
			.post('http://localhost:4001/channel/addMembers', {
				channelName : {name : selectedChannel?.name},
				members : [newMember], // list of new members to add 
			})
			.then((response) => {
				AppDispatch(fetchUserChannels());
				if (selectedChannel)
					AppDispatch(fetchDisplayedChannel(selectedChannel.name));
			})
			.catch((error) => console.log('error while updating members : ', error))
	}
	
	const handleConfirm = () => {
		// add current user to the the selected channel's list of members
		addMembers();
		setIsConfirmed(true);
		setOpenDialog(false);
	};

	const handleCancel = () => {
		// don't do anything
		setIsConfirmed(false);
		setOpenDialog(false);
	};

	return (
		<div>
		<Dialog
			open={openDialog}
			onClose={handleCancel}
			aria-labelledby="enter-channel-confirmation"
			aria-describedby="enter-channel-confirmation"
		>
			<DialogTitle id="enter-channel-confirmation">
			{"Join channel?"}
			</DialogTitle>
			<DialogContent>
			<DialogContentText id="alert-dialog-description">
				By entering this channel you agree to the rules of courtesy defined here:
				<br/>
				<Link>https://gameofthrones.fandom.com/wiki/Guest_right</Link>
			</DialogContentText>
			</DialogContent>
			<DialogActions>
			<Button variant='outlined' onClick={handleCancel}>don't join</Button>
			<Button variant='contained' onClick={handleConfirm} autoFocus>
				join channel
			</Button>
			</DialogActions>
		</Dialog>
		</div>
	);
	}
