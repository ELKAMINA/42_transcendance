import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';

import api from '../utils/Axios-config/Axios';
import {ChannelModel } from '../types/chat/channelTypes';
import { UserByLogin, UserModel } from '../types/users/userType';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import MultipleSelectChip from '../pages/createChannel/createUsersList';
import { selectFriends } from '../redux-features/friendship/friendshipSlice';
import { selectDisplayedChannel, setIsMember } from '../redux-features/chat/channelsSlice';

export default function AddMembersDialog({openDialog, setOpenDialog} : {openDialog : boolean, setOpenDialog : (arg0 : boolean) => void}) {

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const selectedChannel : ChannelModel = useAppSelector((state) => selectDisplayedChannel(state));
	const [updatedMembers, setUpdatedMembers] = React.useState<UserByLogin[]>([]);
	const AppDispatch = useAppDispatch();
	const friends = useAppSelector(selectFriends) as UserModel[];
	const simplifiedFriends: UserByLogin[] = friends.map(({ login }) => ({ login })); // converting UserModel to UserByLogin to keep only login property

	const filteredFriends: UserByLogin[] = simplifiedFriends.filter(friend => {
		const isFriendIncluded = !selectedChannel.members.some(member => member.login === friend.login);
		return isFriendIncluded;
	});

	async function addMembers() : Promise<void> {
		// console.log('updatedMembers = ', updatedMembers);
		await api
			.post('http://localhost:4001/channel/addMembers', {
				channelName : {name : selectedChannel.name},
				members : updatedMembers, // list of new members to add 
			})
			.then((response) => {
				AppDispatch(setIsMember(true));
			})
			.catch((error) => console.log('error while adding members : ', error))
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
