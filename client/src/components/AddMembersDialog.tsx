import React, { useEffect } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { fetchDisplayedChannel, fetchUserChannels, selectDisplayedChannel } from '../redux-features/chat/channelsSlice';
import { UserByLogin, UserModel } from '../types/users/userType';
import api from '../utils/Axios-config/Axios';
import { Channel, ChannelModel } from '../types/chat/channelTypes';
import MultipleSelectChip from '../pages/createChannel/createUsersList';
import SendIcon from '@mui/icons-material/Send';
import { selectFriends } from '../redux-features/friendship/friendshipSlice';

export default function AddMembersDialog({openDialog, setOpenDialog} : {openDialog : boolean, setOpenDialog : (arg0 : boolean) => void}) {

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const selectedChannel : ChannelModel = useAppSelector((state) => selectDisplayedChannel(state));
	const [updatedMembers, setUpdatedMembers] = React.useState<UserByLogin[]>([]);
	const AppDispatch = useAppDispatch();

	// useEffect(() => {
	// 	console.log('selectedChannel.members = ', selectedChannel.members);
	// }, [selectedChannel]);


	const friends = useAppSelector(selectFriends) as UserModel[];
	// console.log('friends = ', friends);

	const filteredFriends: UserModel[] = friends.filter(friend => {
		const isFriendIncluded = !selectedChannel.members.some(member => member.login === friend.login);
		// console.log('Friend:', friend);
		// console.log('Is Friend included:', isFriendIncluded);
		return isFriendIncluded;
	});
		  
	// console.log('Filtered Friends:', filteredFriends);
	  
	async function addMembers() : Promise<void> {
		// console.log('setUpdatedMembers = ', setUpdatedMembers);
		await api
			.post('http://localhost:4001/channel/addMembers', {
				channelName : {name : selectedChannel.name},
				members : updatedMembers,
			})
			.then((response) => {
				// console.log("response = ", response)
				AppDispatch(fetchUserChannels());
				AppDispatch(fetchDisplayedChannel(selectedChannel.name));
			})
			.catch((error) => console.log('error while updating members : ', error))
	}

	const handleClose = () => {
		addMembers();
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
				aria-labelledby="manage-members-dialog"
			>
			<DialogTitle id="manage-members-dialog">
				{"Add members to the channel"}
			</DialogTitle>
			<DialogContent>
				<MultipleSelectChip userList={filteredFriends} setUpdatedMembers={setUpdatedMembers} />
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
