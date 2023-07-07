import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Box, IconButton, ListItemButton, Stack, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { SensorDoor } from '@mui/icons-material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LockIcon from '@mui/icons-material/Lock';
import { fetchUserChannels, selectDisplayedChannel, selectUserChannels } from '../redux-features/chat/channelsSlice';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { Channel } from '../types/chat/channelTypes';
import api from '../utils/Axios-config/Axios';
import ConfirmationDialog from './ConfirmationDialog';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import AlertDialogSlide from './AlertDialogSlide';
import EnterPassword from './EnterPassword';
import * as argon from 'argon2';


type getSelectedItemFunction = (pwd: string) => void;

interface alignItemsProps {
	getSelectedItem: getSelectedItemFunction;
}

export default function AlignItemsList({ getSelectedItem }: alignItemsProps) {
	const [showIcons, setShowIcons] = React.useState(true);
	const [AlertDialogSlideOpen, setAlertDialogSlideOpen] = React.useState(false);
	const AppDispatch = useAppDispatch();
	const channels = useAppSelector((state) => selectUserChannels(state)) as Channel[];
	const selectedChannel = useAppSelector((state) => selectDisplayedChannel(state)) as Channel;
	const [isPasswordCorrect, setIsPasswordCorrect] = React.useState<boolean>(false); 

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
			console.log('channel deleted!');
			AppDispatch(fetchUserChannels());
		})
		.catch((error) => console.log('error while deleting channel', error));
	}

	function handleClick(channelToDelete: string): void {
		console.log('channelToDelete = ', channelToDelete);
		deleteChannel(channelToDelete);
	}


	const [selectedIndex, setSelectedIndex] = React.useState(() => {
		const storedIndex = localStorage.getItem('selectedItemIndex');
		return storedIndex !== null ? Number(storedIndex) : 0;
	});

	const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
		setSelectedIndex(index);
		localStorage.setItem('selectedItemIndex', String(index));
		const clickedItem = channels[index];
		getSelectedItem(clickedItem.name);
		if (clickedItem.key !== '') {
			console.log('propetected by password!')
			setAlertDialogSlideOpen(true);
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

	async function checkPassword(pwd : string) {
		if (selectedChannel.key) {
			try {
				// Verify the password using argon2.verify function
				// const isPasswordCorrect = await argon.verify(selectedChannel.key, pwd);
					await api
						.post('http://localhost:4001/channel/checkPwd', {pwd : pwd, obj : {name : selectedChannel.name}})
						.then((response) => {
							console.log('is password correct? = ', response.data); 
							setIsPasswordCorrect(response.data)
							
						})
						.catch((error) => console.log('caught error while checking password : ', error));
				if (isPasswordCorrect === true) {
				  // enter channel
				  console.log('Password is correct!');
				} else {
				  // do nothing
				  console.log('Wrong password!');
				}
			} catch (error) {
				console.error('Error occurred while verifying password:', error);
			}
		} else {
			console.log("Something went wrong... no need for password here!")
		}
	}

	function handlepwd(pwd: string) {
		checkPassword(pwd);
	}

	return (
		<List sx={{ width: '100%', bgcolor: 'transparent', color: 'white' }}>
			{channels.map((element, index) => (
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
				<AlertDialogSlide 
					open={AlertDialogSlideOpen} 
					setOpen={setAlertDialogSlideOpen} 
					dialogContent={<EnterPassword handlepwd={handlepwd} passwordFieldId={`passwordfield-${index}`}/>} />
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
					{/* <ListItemText sx={{ flexGrow: 1, marginLeft: showIcons ? 1 : 0 }} primary={element.name} /> */}
					<ListItemText
						sx={{ flexGrow: 1, marginLeft: showIcons ? 1 : 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
						primary={element.name}
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
			))}
		</List>
		);
}
