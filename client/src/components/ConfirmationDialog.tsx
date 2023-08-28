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
import { Tooltip, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import Fade from '@mui/material/Fade';

export interface ConfirmationDialogRawProps {
	id: string;
	keepMounted: boolean;
	value: string;
	open: boolean;
	onClose: (value?: string) => void;
	options: string[];
	dialogTitle: string
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
	const { onClose, value: valueProp, open, options, dialogTitle, ...other } = props;
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
			<DialogTitle>{dialogTitle}</DialogTitle>
			<DialogContent dividers>
				<Typography>Beware, this action is permanent.</Typography>
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

type handleConfirmFunction = (channelName: string) => void;

export interface ConfirmationDialogProps {
	title: string;
	id: string;
	options: string[];
	icon: React.ReactNode; // New prop for the icon
	handleConfirm: handleConfirmFunction;
	dialogTitle: string;
	setConfirmationDialogOpen : (arg0 : boolean) => void
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
	const { title, id, options, icon, handleConfirm, dialogTitle, setConfirmationDialogOpen } = props;
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('Dione');

	const handleClickListItem = (event : React.MouseEvent) => {
		event.stopPropagation();
		setConfirmationDialogOpen(true);
		setOpen(true);
	};

	const handleClose = (newValue?: string) => {
		setOpen(false);
		setConfirmationDialogOpen(false);

		if (newValue && newValue !== 'Dione') {
			setValue(newValue);
			handleConfirm('')
		}
	};

	return (
		<Box>
			<Tooltip
				TransitionComponent={Fade}
				TransitionProps={{ timeout: 600 }}
				title={title}>
				<IconButton onClick={handleClickListItem}>
					{icon}
				</IconButton>
			</Tooltip>
			<ConfirmationDialogRaw
				id={id}
				keepMounted
				open={open}
				onClose={handleClose}
				value={value}
				options={options}
				dialogTitle={dialogTitle}
			/>
		</Box>
	);
}
