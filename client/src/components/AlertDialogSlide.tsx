import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type setOpenFunction = (open : boolean) => void;
export interface AlertDialogSlideProps {
	open: boolean,
	setOpen: setOpenFunction,
	dialogContent: React.ReactNode,
}

export default function AlertDialogSlide(props : AlertDialogSlideProps) {
	const {setOpen, open, dialogContent} = props;

  	const handleClose = () => {
   		setOpen(false);
 	};

  return (
    <div>
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
		{dialogContent}
        <DialogActions>
          <Button onClick={handleClose}>Enter channel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}