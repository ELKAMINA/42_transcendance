import React from 'react';
import { Alert, AlertColor, AlertTitle, Box, Collapse } from '@mui/material';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface FullScreenAlertProps {
	severity : AlertColor,
	alertTitle : string,
	normalTxt : string,
	strongTxt : string,
	open : boolean,
	handleClose : () => void,	
}

const FullScreenAlert = ({severity, alertTitle, normalTxt, strongTxt, open, handleClose} : FullScreenAlertProps) => {
	return (
		<Box
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 9999,
			}}
		>
			<Collapse in={open}>
				<Alert
					action={
						<IconButton
							aria-label="close"
							color="inherit"
							// size="small"
							onClick={handleClose}
						>
							<CloseIcon fontSize="inherit" />
						</IconButton>
					}
					severity={severity} 
					sx={{ width: '100%' }}
				>
					<AlertTitle>{alertTitle}</AlertTitle>
					{normalTxt}<strong>{strongTxt}</strong>
				</Alert>
			</Collapse>
    	</Box>
  	);
};

export default FullScreenAlert;
