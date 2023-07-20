import React, { useEffect, useState } from 'react'
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
import api from '../utils/Axios-config/Axios';
import { Channel, ChannelModel } from '../types/chat/channelTypes';
import PasswordField from './PasswordField';
import { FormHelperText, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';


export default function ManagePasswordDialog({openDialog, setOpenDialog} : {openDialog : boolean, setOpenDialog : (arg0 : boolean) => void}) {
	
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const selectedChannel : ChannelModel = useAppSelector((state) => selectDisplayedChannel(state));
	const AppDispatch = useAppDispatch();
	const [updatedPassword, setUpdatedPassword] = useState<string>('');

	async function updatePassword() : Promise<void> {
		await api
			.post('http://localhost:4001/channel/updatePassword', {
				channelName : {name : selectedChannel.name},
				key : updatedPassword,
			})
			.then((response) => {
				AppDispatch(fetchUserChannels());
				AppDispatch(fetchDisplayedChannel(selectedChannel.name));
			})
			.catch((error) => console.log('error while updating members : ', error))
	}

	const handleSubmit = () => {
		if (updatedPassword.length !== 0) {
			updatePassword(); // update password if input is not empty
			setUpdatedPassword(''); // reset
			setOpenDialog(false);
		}
	};

	const handleCancel = () => {
		setOpenDialog(false);
	}

	return (
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={openDialog}
				// onClose={handleCancel}
				aria-labelledby="manage-password"
			>
			<DialogTitle id="manage-password">
				{"Manage password"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{marginTop:'7%', marginBottom: '7%'}}>
					Here you can add a new password if none has been set to the channel, or modify it if it already exists.
				</DialogContentText>
				<PasswordField passwordFieldId={'manage-channel-password'} isPwdCorrect={true} handlePwd={setUpdatedPassword} />
				{updatedPassword.length === 0 &&
					<FormHelperText
					sx={{
						color: 'red',
						fontSize : '1.5em',
					}}
					>enter a new password, or cancel!</FormHelperText>
				}
			</DialogContent>
			<DialogActions
				sx={{
					display: 'flex',
					justifyContent: 'end', // This centers the content horizontally
				}}
			>
				<Button variant="outlined" size='medium' startIcon={<DeleteIcon />} onClick={handleCancel} autoFocus>
					CANCEL
				</Button>
				<Button variant="contained" size='medium' endIcon={<SendIcon />} onClick={handleSubmit} autoFocus>
					SUBMIT
				</Button>
			</DialogActions>
			</Dialog>
		</div>
	);
}
