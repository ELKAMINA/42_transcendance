import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { IconButton, ListItemButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { deleteChat } from '../redux-features/chat/chatsSlice';

type getSelectedItemFunction = (pwd: string) => void;

interface alignItemsProps {
  getSelectedItem: getSelectedItemFunction;
}

export default function AlignItemsList({getSelectedItem} : alignItemsProps) {
	
	const chats = useSelector(( state : RootState) => state.persistedReducer.chats)
	// chats.map(chat => console.log('getting chats : ', chat.login));

	const dispatch = useDispatch();

	// this function allow to remove channels or users from the displayed list
	// it is triggered when the user click on the DeleteButton component
	function handleClick(index: number): void {
		dispatch(deleteChat(chats[index].login))
	}

	// That stuff if to handle what happens when you click on an item of the list -----
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number, ) => {
		setSelectedIndex(index); // get the selected to change its color
		
		const selectedChat = chats[index];
		const chatID = selectedChat.login;
		// console.log("selected chat is ", chatID);
		getSelectedItem(chatID)
	};
	// --------------------------------------------------------------------------------
	  
	return (
		<List sx={{ width: '100%', bgcolor: 'transparent', color: 'white' }}>
			{chats.map((element, index) => (
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
					<ListItem
						alignItems="center"
						secondaryAction={
							<div onClick={() => handleClick(index)}>
								<IconButton aria-label="delete">
								<DeleteIcon sx={{color:'red'}} fontSize='small'/>
								</IconButton>
							</div>
						}
					>
						<ListItemAvatar>
							<Avatar alt={element.login} src={element.avatar} />
						</ListItemAvatar>
						<ListItemText
							sx= {{color:'white'}}
							primary={element.login}
						/>
					</ListItem>
					</ListItemButton>
				</Stack>
			))}
		</List>
		);
}
