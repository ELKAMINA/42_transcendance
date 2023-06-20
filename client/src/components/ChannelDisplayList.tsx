import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Channel } from '../data/channelList';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { IconButton, ListItemButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { FetchAllUsers, selectSuggestions } from '../redux-features/friendship/friendshipSlice';
import { UserDetails } from '../../../server/src/user/types/user-types.user';

type combine = UserDetails | Channel

export default function AlignItemsList() {
	
	const channels: Channel[] = useSelector((state:RootState) => state.persistedReducer.channels);
	// channels.map((channel) => console.log(channel));
	const dispatch = useAppDispatch();

	// when the display channels component is mounted the first time, get the list of users // TO DO : maybe change that
	React.useEffect(() => {dispatch(FetchAllUsers())}, []);

	// get list of users objects in a array
	const allUsers: UserDetails[] = useAppSelector((state) => selectSuggestions(state) as UserDetails[]);
	
	// create an array with channels and users object to display in local storage so that when I refresh the page, the
	// update done to the state of combinedArray are still in memory.
	const [combinedArray, setCombinedArray] = React.useState<combine[]>(() => {
		const storedArray = localStorage.getItem('combinedArray');
		return storedArray ? JSON.parse(storedArray) : [...channels, ...allUsers];
	});

	// this function allow to remove channels or users from the displayed list
	// it is triggered when the user click on the DeleteButton component
	function handleClick(index: number): void {
		setCombinedArray((prevArray) => {
		  const newArray = [...prevArray];
		  newArray.splice(index, 1); // Remove the item at the specified index
		  localStorage.setItem('combinedArray', JSON.stringify(newArray)); // Store the updated array in localStorage
		  return newArray;
		});
	}

	// That stuff if to handle what happens when you click on an item of the list -----
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number, ) => {
		setSelectedIndex(index);
	};
	// --------------------------------------------------------------------------------
	  
	return (
	<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'transparent', color: 'white' }}>
		{combinedArray.map((element, index) => (
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
					alignItems="flex-start"
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
						secondary={
							<React.Fragment>
								<Typography /* replace Ali Connors by the username of the user who last sent a message */
									sx={{ display: 'inline'}}
									component="span"
									variant="body2"
									color="white"
								>
									Ali Connors
								</Typography>
								{" — replace this text by content of the last message sent"} 
							</React.Fragment>
						}
					/>
				</ListItem>
				</ListItemButton>
			</Stack>
		))}
	</List>
	);
}
