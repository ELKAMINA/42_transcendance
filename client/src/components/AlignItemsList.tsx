import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Box, ListItemButton, Stack, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { SensorDoor } from '@mui/icons-material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LockIcon from '@mui/icons-material/Lock';
import { fetchUserChannels, selectDisplayedChannel, selectUserChannels } from '../redux-features/chat/channelsSlice';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { Channel, ChannelModel } from '../types/chat/channelTypes';
import api from '../utils/Axios-config/Axios';
import ConfirmationDialog from './ConfirmationDialog';
import AlertDialogSlide from './AlertDialogSlide';
import EnterPassword from './EnterPassword';
import FullScreenAlert from './FullScreenAlert';
import { RootState } from '../app/store';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { emptyChannel } from '../data/emptyChannel';
import AskForPassword from './AskForPassword';


type alignItemsProps = {
	getSelectedItem: (item: string) => void;
}

export default function AlignItemsList({ getSelectedItem }: alignItemsProps) {
	const [showIcons, setShowIcons] = React.useState(true);
	const [AlertDialogSlideOpen, setAlertDialogSlideOpen] = React.useState(false);

	const AppDispatch = useAppDispatch();
	const channels = useAppSelector((state : RootState) => selectUserChannels(state)) as Channel[];
	const currentUser : string = useAppSelector((state)=> selectCurrentUser(state));
	const selectedChannel: ChannelModel = useAppSelector((state) => selectDisplayedChannel(state)) || emptyChannel;

	React.useEffect(() => { 
		AppDispatch(fetchUserChannels());
		// console.log('selectedChannel.name = ', selectedChannel.name)
		if (channels.findIndex(channel => channel.name === selectedChannel.name) === -1) // when refreshing the page, if the selectedChannel is not in the list of channels anymore, sent index to 0 (aka first item in the list) 
			setSelectedIndex(0);
	}, []);

	async function deleteChannel(channelToDelete: string) {
	await api
		.post('http://localhost:4001/channel/deleteChannelByName', { name: channelToDelete })
		.then((response) => {
			AppDispatch(fetchUserChannels());
		})
		.catch((error) => console.log('error while deleting channel', error));
	}

	function handleClick(channelToDelete: string): void {
		deleteChannel(channelToDelete);
	}

	const [selectedIndex, setSelectedIndex] = React.useState(() => {
		const storedIndex = localStorage.getItem('selectedItemIndex');
		return storedIndex !== null ? Number(storedIndex) : 0;
	});

	const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
		// set index and save it in local storage
		setSelectedIndex(index);
		localStorage.setItem('selectedItemIndex', String(index));

		// get the channel corresponding to the index
		const clickedItem = channels[index];
		
		// if the selected channel is protected by a password, open password dialog slide
		if (clickedItem.key !== '') {
			setAlertDialogSlideOpen(true);
		} else {
			// if no password protection, update 'displayedChannel' slice through prop 'getSelectedItem'
			getSelectedItem(clickedItem.name);
		}
	};

	const handleWindowResize = () => {
		if (window.innerWidth < 600) {
			setShowIcons(false);
		} else {
			setShowIcons(true);
		}
	};

	React.useEffect(() => {
		window.addEventListener('resize', handleWindowResize);
		return () => {
			window.removeEventListener('resize', handleWindowResize);
	};
	}, []);

	return (
		<List sx={{ width: '100%', bgcolor: 'transparent', color: 'white' }}>
			{channels.map((element, index) => {
				return (
					<Stack key={index}>
						<Divider variant="inset" component="li" />
						<ListItemButton
							selected={selectedIndex === index}
							onClick={(event) => handleListItemClick(event, index)}
							sx={{
								'&:hover': { backgroundColor: 'rgba(116, 131, 145, 0.4)' },
								'&.Mui-selected': { backgroundColor: '#032B50' }
							}}
						>
						<ListItem alignItems="center">
							<ListItemAvatar>
							<Avatar alt={element.name} src={element.avatar} />
							</ListItemAvatar>
							<Stack direction="row" alignItems="center" spacing={2}>
							{showIcons && element.type === 'private' && (
								<Tooltip title="private channel" placement="top">
								<SensorDoor />
								</Tooltip>
							)}
							{showIcons && element.type === 'public' && (
								<Tooltip title="public channel" placement="top">
								<Diversity3Icon />
								</Tooltip>
							)}
							{showIcons && element.key !== '' && (
								<Tooltip title="protected by password" placement="top">
								<LockIcon />
								</Tooltip>
							)}
							</Stack>
							<ListItemText
								sx={{ flexGrow: 1, marginLeft: showIcons ? 1 : 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
								primary={element.name === currentUser ? element.createdBy.login : element.name}
							/>

							{showIcons && (
							<Box>
								<ConfirmationDialog
									title = 'delete channel'
									id = 'delete-channel'
									options = { ['Yes, I want to delete this channel.'] }
									icon={
										<DeleteIcon sx={{ color: 'red', p: 0, marginLeft: 'auto',}} fontSize="small"/>
									}
									handleConfirm={() => handleClick(element.name)}
									dialogTitle='Delete this channel from the database?'
								/>
							</Box>)}
						</ListItem>
						</ListItemButton>
					</Stack>
				);
			})}
			< AskForPassword
				AlertDialogSlideOpen={AlertDialogSlideOpen}
				setAlertDialogSlideOpen={setAlertDialogSlideOpen}
				getSelectedItem={getSelectedItem}
				element={channels[selectedIndex]}
			/>
		</List>
		);
}
