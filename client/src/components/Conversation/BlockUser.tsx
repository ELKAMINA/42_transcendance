import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material'
import React from 'react'
import { TransitionProps } from '@mui/material/transitions';
import { Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { selectCurrentUser } from '../../redux-features/auth/authSlice';

type BlockUserProps = {
	open: boolean;
	sender: string;
	receiver: string;
	handleClose: React.Dispatch<React.SetStateAction<boolean>>
	socketRef: React.MutableRefObject<Socket | undefined>;
	blocks: string,
};

const BlockUser = ({open , handleClose, socketRef, sender, receiver, blocks} : BlockUserProps ) => {
	// console.log("current user ", currentUser);
	// console.log("blocks ", blocks);

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
		socketRef.current?.emit('blockUser', {
			sender: sender,
			receiver: receiver,
		})

	};

	// React.useEffect(() => {
	// 	return () => {
	// 	}
	// }, [])

	return (
	<Dialog
		open={open}
		TransitionComponent={Transition}
		keepMounted
		onClose={handleClose}
		aria-describedby="alert-dialog-slide-description"
		>
		<DialogTitle>
			{blocks === 'block' && "Block this user ?"}
			{blocks === 'unblock' && "Unblock this user ?"}
		</DialogTitle>
		<DialogContent>
			<DialogContentText id="alert-dialog-slide-description">
				{ blocks === 'block' && "Are you sure you want to block this user ?"}
				{ blocks === 'unblock' && "Are you sure you want to unblock this user ?"}
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