import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAppSelector } from '../utils/redux-hooks';
import { selectDisplayedChannel } from '../redux-features/chat/channelsSlice';
import { ChannelModel } from '../types/chat/channelTypes';

export type ChannelInfoDialogProps = {
	openDialog : boolean, 
	setOpenDialog : (arg0 : boolean) => void
}

export default function ChannelInfoDialog({openDialog, setOpenDialog} : ChannelInfoDialogProps) {

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const selectedChannel : ChannelModel = useAppSelector(selectDisplayedChannel);

	const adminsLogins: string[] = selectedChannel.admins.map((admin) => admin.login);
	const adminsString: string = adminsLogins.join(' | ');
	
	const membersLogins: string[] = selectedChannel.members.map((member) => member.login);
	const membersString: string = membersLogins.join(' | ');

	const bannedLogins: string[] = selectedChannel.banned.map((banned) => banned.login);
	const bannedString: string = bannedLogins.join(' | ');

	const mutedLogins: string[] = selectedChannel.muted.map((muted) => muted.login);
	const mutedString: string = mutedLogins.join(' | ');

	function handleClose() {
		setOpenDialog(false);
	}

	return (
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={openDialog}
				onClose={handleClose}
				aria-labelledby="manage-password"
			>
			<DialogTitle id="manage-password" sx={{color: '#07457E', fontWeight: 'bold'}}>
				{"Info"}
			</DialogTitle>
			<DialogContent>
			<DialogContentText >
				Creator 🖌️ : {selectedChannel.createdById}
			</DialogContentText>
			<br />
			<DialogContentText>
				Owner 👑 : {selectedChannel.ownedById}
			</DialogContentText>
			<br />
			<DialogContentText>
				Members 😄 : {membersString} 
			</DialogContentText>
			<br />
			<DialogContentText>
				Admins 📝 : {adminsString} 
			</DialogContentText>
			<br />
			<DialogContentText>
				Muted 🔇 : {mutedString}
			</DialogContentText>
			<br />
			<DialogContentText>
				Banned 🐦‍⬛ : {bannedString}
			</DialogContentText>
			<br />

			</DialogContent>
			<DialogActions
				sx={{
					display: 'flex',
					justifyContent: 'end', // This centers the content horizontally
					padding: '20px',
				}}
			>
				<Button variant="contained" sx={{ backgroundColor: '#07457E' }} size='medium' onClick={handleClose} autoFocus>
					EXIT
				</Button>
			</DialogActions>
			</Dialog>
		</div>
	);
}