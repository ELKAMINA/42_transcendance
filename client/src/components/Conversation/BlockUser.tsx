import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material'
import React from 'react'
import { TransitionProps } from '@mui/material/transitions';
import { useSocket } from '../../socket/SocketManager';

type BlockUserProps = {
	open: boolean;
	sender: string;
	receiver: string;
	handleClose: React.Dispatch<React.SetStateAction<boolean>>
	// socketRef: React.MutableRefObject<Socket | undefined>;
};

const BlockUser = ({open , handleClose, /*socketRef,*/ sender, receiver} : BlockUserProps ) => {
	const socket = useSocket();
	React.useEffect(() => {
		if (!socket)
			return ;
		return () => {
			socket?.disconnect()
		}
	}, [socket])

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
		socket?.emit('blockUser', {
			sender: sender,
			receiver: receiver,
		})
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
