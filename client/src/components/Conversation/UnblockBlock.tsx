import React from 'react'
import { TransitionProps } from '@mui/material/transitions';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography } from '@mui/material'
import { useAppSelector } from '../../utils/redux-hooks';
import { blockUnblock } from './Footer';
import { selectCurrentUser } from '../../redux-features/auth/authSlice';

type BlockUserProps = {
	open: boolean;
	handleClose: React.Dispatch<React.SetStateAction<boolean>>
    info: blockUnblock;
};

const UnblockBlock = ({open , handleClose, info} : BlockUserProps ) => {
    const user = useAppSelector(selectCurrentUser)
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
	};
	
	return (
	<Dialog
		open={open}
		TransitionComponent={Transition}
		keepMounted
		onClose={handleClose}
		aria-describedby="alert-dialog-slide-description"
		>
		<DialogTitle>{"From Hate to Love, there is only one step"}</DialogTitle>
		<DialogContent>
			<DialogContentText id="alert-dialog-slide-description">
				{(user === info.senderReceiver.sender) && (info.status === 1) && <Typography component="span">
                    You blocked {info.senderReceiver.receiver}, you can't talk to each other anymore
                    </Typography>}
                {(user === info.senderReceiver.receiver) && (info.status === 1) && <Typography component="span">
                    {info.senderReceiver.sender} blocked you, you can't talk to each other anymore
                    </Typography>}
                {(user === info.senderReceiver.receiver) && (info.status === 2) && <Typography component="span">
                {info.senderReceiver.sender} unblocked you, you can now talk 
                </Typography>}
                {(user === info.senderReceiver.sender) && (info.status === 2) && <Typography component="span">
                    You unblocked {info.senderReceiver.receiver}, you can now talk
                </Typography>}
				{info.senderReceiver.receiver === '' && <Typography component="span">
					You cant talk to each other. BLOCKED CONVERSATION
                </Typography>}
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button onClick={handleCancel}>OK</Button>
		</DialogActions>
		</Dialog>
	)
}

export default UnblockBlock