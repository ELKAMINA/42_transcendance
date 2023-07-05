import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { IconButton, ListItemButton, Stack, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { SensorDoor } from '@mui/icons-material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LockIcon from '@mui/icons-material/Lock';
import { fetchUserChannels, selectUserChannels } from '../redux-features/chat/channelsSlice';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { Channel } from '../types/chat/channelTypes';
import api from '../utils/Axios-config/Axios';

type getSelectedItemFunction = (pwd: string) => void;

interface alignItemsProps {
getSelectedItem: getSelectedItemFunction;
}

export default function AlignItemsList({ getSelectedItem }: alignItemsProps) {
	const [showIcons, setShowIcons] = React.useState(true);
	const AppDispatch = useAppDispatch();
	const channels = useAppSelector((state) => selectUserChannels(state)) as Channel[];

	React.useEffect(() => { AppDispatch(fetchUserChannels()); }, []);

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
		deleteChannel(channelToDelete);
	}

	const [selectedIndex, setSelectedIndex] = React.useState(() => {
	const storedIndex = localStorage.getItem('selectedItemIndex');
		return storedIndex !== null ? Number(storedIndex) : 0;
	});

	const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
		setSelectedIndex(index);
		localStorage.setItem('selectedItemIndex', String(index));
		getSelectedItem(channels[index].name);
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
					<IconButton aria-label="delete" sx={{ p: 0,  marginLeft: 'auto' }}>
						<Tooltip title="delete chat" placement="top">
						<DeleteIcon sx={{ color: 'red' }} fontSize="small" />
						</Tooltip>
					</IconButton>
					)}
				</ListItem>
				</ListItemButton>
			</Stack>
			))}
		</List>
		);
}
