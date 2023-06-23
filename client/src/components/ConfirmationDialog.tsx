import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Fade from '@mui/material/Fade';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAllChats } from '../redux-features/chat/chatsSlice';

const options = [
  'Yes, I do want to delete all my chats',
];

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Delete all?</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="confirmation"
          name="confirmation"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ConfirmationDialog() {
  	const [open, setOpen] = React.useState(false);
  	const [value, setValue] = React.useState('Dione');

	const dispatch = useDispatch();

  	const handleClickListItem = () => {
    	setOpen(true);
  	};

  	const handleClose = (newValue?: string) => {
  	  setOpen(false);

  	  if (newValue) {
		console.log(newValue);
  	    setValue(newValue);
		dispatch(deleteAllChats(true));
  	  }
  	};

  return (
    <Box>
      <Tooltip
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }} 
        title="delete all">
      <IconButton onClick={handleClickListItem}>
        <ClearAllIcon sx={{color: 'white',}} fontSize='medium'/>
      </IconButton>
      </Tooltip>
      <ConfirmationDialogRaw
        id="delete-chats"
        keepMounted
        open={open}
        onClose={handleClose}
        value={value}
      />
    </Box>
  );
}
