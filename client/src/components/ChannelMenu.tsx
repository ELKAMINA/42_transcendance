import * as React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import { IconButton, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Socket } from 'socket.io-client';
import AddMembersDialog from './AddMembersDialog';
import ManageAdminDialog from './ManageAdminDialog';
import ChannelInfoDialog from './ChannelInfoDialog';
import { useAppSelector } from '../utils/redux-hooks';
import LeaveChannelDialog from './LeaveChannelDialog';
import { ChannelModel } from '../types/chat/channelTypes';
import ManagePasswordDialog from './ManagePasswordDialog';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { selectDisplayedChannel } from '../redux-features/chat/channelsSlice';
import { emptyChannel } from '../data/emptyChannel';

export type ChannelMenuProps = {
	socketRef: React.MutableRefObject<Socket | undefined>;
}

export default function ChannelMenu({socketRef} : ChannelMenuProps) {
	const [open, setOpen] = React.useState<boolean>(false);
	const [openAdminDialog, setOpenAdminDialog] = React.useState<boolean>(false);
	const [openAddMembers, setOpenAddMembers] = React.useState<boolean>(false);
	const [openManagePassword, setOpenManagePassword] = React.useState<boolean>(false);
	const [openLeaveChannel, setOpenLeaveChannel] = React.useState<boolean>(false);
	const [openChannelInfo, setOpenChannelInfo] = React.useState<boolean>(false);

	const anchorRef = React.useRef<HTMLButtonElement>(null);
	
	// return focus to the button when we transitioned from !open -> open
	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current!.focus();
		}

		prevOpen.current = open;
	}, [open]);

	// check if user is owner of the selected channel
	const currentUser : string = useAppSelector(selectCurrentUser);
	const selectedChannel : ChannelModel = useAppSelector(selectDisplayedChannel)
	if (!selectedChannel)
		return ;
	const isOwner : boolean = currentUser === selectedChannel.ownedById ? true : false;
	// console.log("isOwner = ", isOwner);
	const isAdmin : boolean = selectedChannel.admins.some(admin => admin.login === currentUser) || currentUser === selectedChannel.ownedById
	// console.log("isAdmin = ", isAdmin);


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
			case 'manageAdmin' : {
				setOpenAdminDialog(true);
				break;
			}
			case 'addMembers' : {
				setOpenAddMembers(true);
				break;
			}
			case 'managePassword' : {
				setOpenManagePassword(true);
				break;
			}
			case 'channelInfo' : {
				setOpenChannelInfo(true);
				break;
			}
			case 'leaveChannel' : {
				setOpenLeaveChannel(true);
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

	return (
		<React.Fragment>

		<Stack direction="row" spacing={2}>
		<div>
			<Tooltip title='channel menu'>
				<IconButton
					ref={anchorRef}
					id="composition-button"
					aria-controls={open ? 'composition-menu' : undefined}
					aria-expanded={open ? 'true' : undefined}
					aria-haspopup="true"
					onClick={handleToggle}
					sx={{color: '#07457E'}}
				>
					<ExpandMoreIcon />
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
								{isOwner &&	<MenuItem onClick={(event) => handleClose(event, 'manageAdmin')}>manage admins</MenuItem>}
								{isAdmin &&	<MenuItem onClick={(event) => handleClose(event, 'addMembers')}>add members</MenuItem>}
								{isOwner &&	<MenuItem onClick={(event) => handleClose(event, 'managePassword')}>add / manage password</MenuItem>}
								{<MenuItem onClick={(event) => handleClose(event, 'channelInfo')}>info about channel</MenuItem>}
								{isOwner === false && <MenuItem onClick={(event) => handleClose(event, 'leaveChannel')}>leave channel</MenuItem>}
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
			</Popper>
		</div>
		</Stack>
			<ManageAdminDialog openDialog={openAdminDialog} setOpenDialog={setOpenAdminDialog}/>
			<AddMembersDialog openDialog={openAddMembers} setOpenDialog={setOpenAddMembers}/>
			<ManagePasswordDialog openDialog={openManagePassword} setOpenDialog={setOpenManagePassword}/>
			<ChannelInfoDialog openDialog={openChannelInfo} setOpenDialog={setOpenChannelInfo}/>
			<LeaveChannelDialog socketRef={socketRef} openDialog={openLeaveChannel} setOpenDialog={setOpenLeaveChannel}/>
		</React.Fragment>

	);
}