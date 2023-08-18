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
import { fetchAllChannelsInDatabase, fetchDisplayedChannel, fetchUserChannels, selectDisplayedChannel, selectUserChannels } from '../redux-features/chat/channelsSlice';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { Channel, ChannelModel } from '../types/chat/channelTypes';
import api from '../utils/Axios-config/Axios';
import ConfirmationDialog from './ConfirmationDialog';
import FullScreenAlert from './FullScreenAlert';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { emptyChannel } from '../data/emptyChannel';
import AskForPassword from './AskForPassword';


type alignItemsProps = {
	getSelectedItem: (item: string) => void;
	channelDeleted: React.MutableRefObject<boolean>;
}

export default function AlignItemsList({ getSelectedItem, channelDeleted }: alignItemsProps) {
	const [showIcons, setShowIcons] = React.useState(true);
	const [AlertDialogSlideOpen, setAlertDialogSlideOpen] = React.useState(false);
	const [alertError, setAlertError] = React.useState<boolean>(false);

	const AppDispatch = useAppDispatch();
	const currentUser : string = useAppSelector(selectCurrentUser);
	const selectedChannel: ChannelModel = useAppSelector((state) => selectDisplayedChannel(state)) || emptyChannel;
	
	const channels = useAppSelector(selectUserChannels) as Channel[];
	const [channelsForDisplay, setchannelsForDisplay] = React.useState<Channel[]>([]); // this is a state for the formated channels, aka with private convs names updated according to current user
	React.useEffect(() => {
		// console.log('channels = ', channels);
		const modifiedChannels = channels.map((channel) => {
			const modifiedChannel = { ...channel };
			if (channel.type === 'privateConv') { // if the channel is a private conv
				if (channel.members[0].login === currentUser) {
					modifiedChannel.name = channel.members[1].login;
				}
				else {
					modifiedChannel.name = channel.members[0].login;
				}
				return modifiedChannel;
			}
			return channel;
		})
		setchannelsForDisplay(modifiedChannels)
	}, [channels, currentUser])

	// React.useEffect(() => {
		// console.log('channelsForDisplay = ', channelsForDisplay)
	// }, [channelsForDisplay])

	// React.useEffect(() => {
	// 	console.log('User channels = ', channels);
	// }, [channels])
	const getSelectedChannelIndex = () => channels.findIndex(channel => channel.name === selectedChannel.name);

	React.useEffect(() => {
		// console.log('selectedChannel camembert = ', selectedChannel);
		if (selectedChannel.name === 'WelcomeChannel') { // if selectedChannel is the welcome channel
			setSelectedIndex(-1); // dont select any item
			return ;
		}

		const index = getSelectedChannelIndex();
		setSelectedIndex(index);
		
	}, [selectedChannel])


	React.useEffect(() => { 
		AppDispatch(fetchUserChannels());
		// console.log('user channels = ', channels);
		if (getSelectedChannelIndex() === -1) // when refreshing the page, if the selectedChannel is not in the list of channels anymore, sent index to 0 (aka first item in the list) 
			setSelectedIndex(0);
	}, []);

	async function deleteChannel(channelToDelete: string) {

	await api
		.post('http://localhost:4001/channel/deleteChannelByName', { name: channelToDelete })
		.then((response) => {
			AppDispatch(fetchUserChannels());
			AppDispatch(fetchDisplayedChannel('WelcomeChannel'))
			AppDispatch(fetchAllChannelsInDatabase())
			getSelectedItem('WelcomeChannel');

			channelDeleted.current = true;
		})
		.catch((error) => console.log('error while deleting channel', error));
	}

	function handleClick(channelToDelete: string, index : number): void {
		// only the creator/owner of the channel can delete it
		if (currentUser === channels[index].createdBy.login)
			deleteChannel(channelToDelete);
		else
			setAlertError(true);
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
			// console.log('[From AlignItems Component :  clickedItem.name]', clickedItem.name)
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

	const handleCloseAlert = () => {
		setAlertError(false);
	}

	return (
		<List sx={{ width: '100%', bgcolor: 'transparent', color: 'white' }}>
			{channelsForDisplay.map((element, index) => {
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

							{showIcons && element.type !== 'privateConv' && (
							<Box>
								<ConfirmationDialog
									title = 'delete channel'
									id = 'delete-channel'
									options = { ['Yes, I want to delete this channel.'] }
									icon={
										<DeleteIcon sx={{ color: 'red', p: 0, marginLeft: 'auto',}} fontSize="small"/>
									}
									handleConfirm={() => handleClick(element.name, index)}
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
			{ alertError &&
				<FullScreenAlert severity='error' alertTitle='Error' normalTxt='cannot delete channel --' 
					strongTxt='you cannot delete a channel you do not own!' open={alertError} handleClose={handleCloseAlert}/>
			}
		</List>
		);
}
