import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { Tooltip } from '@mui/material';
import GiveOwnerShipDialog from './GiveOwnerShipDialog';


export default function GiveOwnership() {

	const [openDialog, setOpenDialog] = useState<boolean>(false);

	function handleClick() {
		setOpenDialog(true)
	}

	return (
		<div>
			<Tooltip title='make an heir'>
				<IconButton onClick={handleClick}>
					<FingerprintIcon />
				</IconButton>
			</Tooltip>
			<GiveOwnerShipDialog openDialog={openDialog} setOpenDialog={setOpenDialog}/>
		</div>
	)
}