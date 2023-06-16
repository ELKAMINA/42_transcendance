import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Channel } from '../data/channelList';
import { User, userList } from '../data/userList';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

type combine = User | Channel

export default function AlignItemsList() {
	
	const channels = useSelector((state:RootState) => state.persistedReducer.channels);
	
	// TO DO -> replace userList with Amina's users array
	const combinedArray: combine[] = [...channels, ...userList];

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
						<Avatar alt={element.name} src={element.profile_picture} />
					</ListItemAvatar>
					<ListItemText
						sx= {{color:'white'}}
						primary={element.name}
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
