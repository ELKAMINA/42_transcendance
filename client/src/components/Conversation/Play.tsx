import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material'
import React from 'react'
import { TransitionProps } from '@mui/material/transitions';
import { Socket } from 'socket.io-client';


type PlayConfirmation = {
	open: boolean;
	sender: string;
	receiver: string;
	handleClose: React.Dispatch<React.SetStateAction<boolean>>
	socketRef: React.MutableRefObject<Socket | undefined>;
};
const PlayConfirmation = ({open , handleClose, socketRef, sender, receiver} : PlayConfirmation ) => {

	// console.log("socketRef in block user = ", socketRef?.current?.id);

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
        console.log('jai refusé la partie')
        // socketRef.current?.emit('')
	};
	
	const handlePlayingConfirmation = () => {
        socketRef.current?.emit('AnswerPlayingToServer', true)
        handleClose(false); // Pass false to undisplay the dialog
	};

	return (
	<Dialog
		open={open}
		TransitionComponent={Transition}
		keepMounted
		onClose={handleClose}
		aria-describedby="alert-dialog-slide-description"
		>
		<DialogTitle>{sender} invited you to play Pong</DialogTitle>
		<DialogContent>
			<DialogContentText id="alert-dialog-slide-description">
				Do you want to join ?
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button onClick={handleCancel}>Cancel</Button>
			<Button onClick={handlePlayingConfirmation}>Yes</Button>
		</DialogActions>
		</Dialog>
	)
}

export default PlayConfirmation;