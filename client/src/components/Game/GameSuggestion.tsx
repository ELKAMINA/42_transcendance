import * as React from 'react';
import { Box, IconButton } from '@mui/material';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {DialogContent} from '@mui/material';
import {CircularProgress} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import { TransitionProps } from '@mui/material/transitions';
import { dialogInfo } from '../Conversation/Conversation';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type setOpenFunction = (open : boolean) => void;
export type handleCloseFunction = () => void;

export interface AlertDialogSlideProps {
	open: boolean,
	handleClose: handleCloseFunction,
	dialogContent: dialogInfo,
    onAcceptingGame: (gameAcceptance: any) => void;
    onDeny: () => void;
    onCancel: () => void;
}

export default function GameSuggestion(props : AlertDialogSlideProps) {
	const {open, handleClose, dialogContent} = props;
	return (
		<Box>
        {dialogContent.waiting === true && 
            <>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                    sx={{
                        '& .MuiBackdrop-root': { // backdrop = toile de fond
                        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the opacity as needed
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems:'center',
                    }}>
                        <DialogContent sx={{
                            margin: 2,
                        }}>
                            {dialogContent.content}
                        </DialogContent>
                        <CircularProgress color="primary" />
                    </Box>
                    <DialogActions>
                        <Button onClick={()=> props.onCancel()}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </>
        }
        {dialogContent.waiting === false && 
            <>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                    sx={{
                        '& .MuiBackdrop-root': { // backdrop = toile de fond
                        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the opacity as needed
                        },
                    }}
                >
                    <DialogContent>
                        {dialogContent.content}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=> props.onAcceptingGame(dialogContent)}>Accept</Button>
                        <Button onClick={()=> props.onDeny()}>Deny</Button>
                    </DialogActions>
                </Dialog>
            </>
        }
		</Box>
	);
}