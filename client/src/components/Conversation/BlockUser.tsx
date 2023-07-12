import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material'
import React from 'react'
import { TransitionProps } from '@mui/material/transitions';

const BlockUser = ({open , handleClose} : { open: boolean; handleClose: React.Dispatch<React.SetStateAction<boolean>> }) => {

	// to give the slide effect
	const Transition = React.forwardRef(function Transition(
		props: TransitionProps & {
			children: React.ReactElement<any, any>;
		},
		ref: React.Ref<unknown>,
		) {
		return <Slide direction="up" ref={ref} {...props} />;
		});

	const handleCancel = () => {
		handleClose(false); // Pass false to indicate cancel
	};
	
	const handleBlock = () => {
		handleClose(true); // Pass true to indicate block
	};

	return (
	<Dialog
		open={open}
		TransitionComponent={Transition}
		keepMounted
		onClose={handleClose}
		aria-describedby="alert-dialog-slide-description"
		>
		<DialogTitle>{"Block this user"}</DialogTitle>
		<DialogContent>
			<DialogContentText id="alert-dialog-slide-description">
				Are you sure you want to block this user?
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button onClick={handleCancel}>Cancel</Button>
			<Button onClick={handleBlock}>Yes</Button>
		</DialogActions>
		</Dialog>
	)
}

export default BlockUser
