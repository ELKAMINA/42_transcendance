import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function ManageAdminDialog({openDialog, setOpenDialog} : {openDialog : boolean, setOpenDialog : (arg0 : boolean) => void}) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const handleClose = () => {
		setOpenDialog(false);
	};

  return (
	<div>
		<Dialog
			fullScreen={fullScreen}
			open={openDialog}
			onClose={handleClose}
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
		</DialogContent>
		<DialogActions>
			<Button autoFocus onClick={handleClose}>
			Disagree
			</Button>
			<Button onClick={handleClose} autoFocus>
			Agree
			</Button>
		</DialogActions>
		</Dialog>
	</div>
	);
}