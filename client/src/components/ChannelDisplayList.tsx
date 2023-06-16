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
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { FetchAllUsers, selectSuggestions } from '../redux-features/friendship/friendshipSlice';
import { UserDetails } from '../../../server/src/user/types/user-types.user';

type combine = UserDetails | Channel

export default function AlignItemsList() {
	
	const channels = useSelector((state:RootState) => state.persistedReducer.channels);

	const dispatch = useAppDispatch();

	// when the search component is mounted the first time, get the list of users
	React.useEffect(() => {dispatch(FetchAllUsers())}, []);

	// const allUsers:UserDetails[] = useAppSelector(selectSuggestions);
	const allUsers: UserDetails[] = useAppSelector((state) => selectSuggestions(state) as UserDetails[]);
	
	const combinedArray: combine[] = [...channels, ...allUsers];

	return (
	<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'transparent', color: 'white' }}>
		{combinedArray.map((element, index) => (
			<React.Fragment key={index}>
				<Divider variant="inset" component="li" />
				<ListItem
					alignItems="flex-start"
					secondaryAction={
						<IconButton aria-label="delete">
						  <DeleteIcon sx={{color:'red'}} fontSize='small'/>
						</IconButton>
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
								<Typography
									sx={{ display: 'inline'}}
									component="span"
									variant="body2"
									color="white"
								>
									Ali Connors
								</Typography>
								{" — I'll be in your neighborhood doing errands this…"}
							</React.Fragment>
						}
					/>
				</ListItem>
			</React.Fragment>
		))}
	</List>
	);
}
