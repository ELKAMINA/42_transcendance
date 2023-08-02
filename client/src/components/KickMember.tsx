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
import { fetchDisplayedChannel, fetchUserChannels, selectDisplayedChannel } from '../redux-features/chat/channelsSlice';
import api from '../utils/Axios-config/Axios';
import { ChannelModel } from '../types/chat/channelTypes';
import { UserByLogin, UserModel } from '../types/users/userType';
import SendIcon from '@mui/icons-material/Send';
import { Socket } from 'socket.io-client';

export type KickMemberProps = {
	socketRef: React.MutableRefObject<Socket | undefined>,
	openDialog : boolean, 
	setOpenDialog : (arg0 : boolean) => void
}

export default function KickMember({socketRef, openDialog, setOpenDialog} : KickMemberProps) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const selectedChannel : ChannelModel = useAppSelector((state) => selectDisplayedChannel(state));
	const [updatedKicked, setUpdatedKicked] = React.useState<UserModel[]>([]);
	// const AppDispatch = useAppDispatch();

	function filterKickedMembersFromChannel() {
		const filteredMembers = selectedChannel.members
		  .filter(member => !updatedKicked.some(kickedOutMember => member.login === kickedOutMember.login))
		  .map(member => ({ login: member.login }));
	  
		console.log('filteredMembers = ', filteredMembers);
		KickMemberOut(filteredMembers);
	}
	  
	async function KickMemberOut(updatedMember : UserByLogin[]) {
		await api
		.post('http://localhost:4001/channel/replaceMembers', {
			channelName : {name : selectedChannel.name},
			members : updatedMember,
		})
		.then((response) => {
			updatedKicked.map(kickedMember => {
				// emit user has been kick out message
				socketRef.current?.emit('LeavingChannel', {
					sentBy: kickedMember.login,
					message :`${kickedMember.login} has been kicked out of the channel!`,
					sentAt: new Date(),
					senderSocketId: socketRef.current.id,
					incoming: true,
					outgoing: false,
					subtype: 'InfoMsg',
					channel: selectedChannel.name,
					channelById: selectedChannel.name,
				});
			})
		})
		.catch((error) => console.log('error while updating members : ', error))
	}

	const handleClose = () => {
		filterKickedMembersFromChannel();
		setOpenDialog(false);
	};

	const handleCancel = () => {
		setOpenDialog(false);
	};

	React.useEffect(() => {

	})

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
				aria-labelledby="kick-member-dialog"
				maxWidth="sm" // Set the maxWidth to "md" for medium width

			>
			<DialogTitle id="kick-member-dialog">
				{"Kick a member out of the channel"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Kick someone out.
					<br />
					Kicking people out means revoking their membership.
				</DialogContentText>
				<UserList 
					usersSet={membersOptions} 
					initialUsers={selectedChannel.members} 
					setUpdatedUsers={setUpdatedKicked} 
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