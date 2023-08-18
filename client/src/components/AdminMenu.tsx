import * as React from 'react';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { IconButton, Tooltip } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import KickMember from './KickMember';
import { Socket } from 'socket.io-client';
import ManageMutedDialog from './ManageMutedDialog';
import ManageBannedDialog from './ManageBannedDialog';


export type AdminMenuProps = {
	socketRef: React.MutableRefObject<Socket | undefined>;
}

export default function AdminMenu({socketRef} : AdminMenuProps) {
	const [open, setOpen] = React.useState<boolean>(false);
	const [openBannedDialog, setOpenBannedDialog] = React.useState<boolean>(false);
	const [openMutedDialog, setOpenMutedDialog] = React.useState<boolean>(false);
	const [openKickMemberDialog, setOpenKickMemberDialog] = React.useState<boolean>(false);

	// check if user is owner of the selected channel
	// const currentUser : string = useAppSelector(selectCurrentUser);
	// const selectedChannel : ChannelModel = useAppSelector(selectDisplayedChannel)

	const anchorRef = React.useRef<HTMLButtonElement>(null);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event: Event | React.SyntheticEvent, actionSelected?: string) => {
		if (
			anchorRef.current &&
			anchorRef.current.contains(event.target as HTMLElement)
		) {
			return;
		}
	  
		setOpen(false);

		switch (actionSelected) {
			case 'ban member' : {
				setOpenBannedDialog(true);
				break;
			}
			case 'mute member' : {
				setOpenMutedDialog(true);
				break;
			}
			case 'kick' : {
				setOpenKickMemberDialog(true);
				break;
			}
			default :
				return ;
		}
	};
	  
	function handleListKeyDown(event: React.KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		} else if (event.key === 'Escape') {
			setOpen(false);
		}
	}

	// return focus to the button when we transitioned from !open -> open
	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current!.focus();
		}

		prevOpen.current = open;
	}, [open]);



	return (
		<React.Fragment>

		<Stack direction="row" spacing={2}>
		<div>
			<Tooltip title='admin privileges'>
				<IconButton
					ref={anchorRef}
					id="composition-button"
					aria-controls={open ? 'composition-menu' : undefined}
					aria-expanded={open ? 'true' : undefined}
					aria-haspopup="true"
					onClick={handleToggle}
					sx={{color: '#e33100'}}
				>
					<AdminPanelSettingsIcon />
				</IconButton>
			</Tooltip>
			<Popper
				open={open}
				anchorEl={anchorRef.current}
				role={undefined}
				placement="bottom-start"
				transition
				disablePortal
			>
			{({ TransitionProps, placement }) => (
				<Grow
					{...TransitionProps}
					style={{
						transformOrigin:
						placement === 'bottom-start' ? 'left top' : 'left bottom',
					}}
				>
					<Paper>
						<ClickAwayListener onClickAway={handleClose}>
							<MenuList
								autoFocusItem={open}
								id="composition-menu"
								aria-labelledby="composition-button"
								onKeyDown={handleListKeyDown}
							>
								<MenuItem onClick={(event) => handleClose(event, 'ban member')}>ban member(s)</MenuItem>
								<MenuItem onClick={(event) => handleClose(event, 'kick')}>kick membe(s) out</MenuItem>
								<MenuItem onClick={(event) => handleClose(event, 'mute member')}>mute member(s)</MenuItem>
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
			</Popper>
		</div>
		</Stack>
			<ManageBannedDialog openDialog={openBannedDialog} setOpenDialog={setOpenBannedDialog}/>
			<ManageMutedDialog socketRef={socketRef} openDialog={openMutedDialog} setOpenDialog={setOpenMutedDialog}/>
			<KickMember socketRef={socketRef} openDialog={openKickMemberDialog} setOpenDialog={setOpenKickMemberDialog}/>
		</React.Fragment>

	);
}