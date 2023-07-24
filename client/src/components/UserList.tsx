import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { UserModel } from '../types/users/userType';
import ResponsiveTimePickers from './ResponsiveTimePicker';
import ResponsiveTimePicker from './ResponsiveTimePicker';
import { Box, Button, FormControlLabel, Stack, Tooltip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

type UserListProps = {
	usersSet : UserModel[], // a list of users amongs which you make your selection
	initialUsers : UserModel[], // a lits of users initially selected
	setUpdatedUsers : (admins : UserModel[]) => void, // a function to update the selected users
}

export default function UserList({usersSet, initialUsers, setUpdatedUsers} : UserListProps) {
	const userIndexes: number[] = initialUsers.map((admin) =>
		usersSet.findIndex((user) => user.login === admin.login)
	);
	
	const [checked, setChecked] = React.useState<number[]>(userIndexes.filter(index => index !== -1));
	const [timeChecked, setTimeChecked] = React.useState<number[]>([-1]);

	const handleToggle = (value: number) => () => {
		
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];
	
		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
	    }

    	setChecked(newChecked);
		const updatedUsers: UserModel[] = [...newChecked.map((index) => usersSet[index])];
		setUpdatedUsers(updatedUsers);
  	};

	const handleTimeToggle = (value: number) => () => {
		const currentIndex = timeChecked.indexOf(value);
		const newChecked = [...timeChecked];
	
		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
	    }

    	setTimeChecked(newChecked);
	}

	function handleSelectedTime(user : UserModel, time : string) {
		console.log('user = ', user);
		console.log('selected time = ', time);
	}

	return (
		<List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
		{usersSet.map((el, value) => {
			const labelId = `checkbox-list-secondary-label-${value}`;
			const isChecked = checked.indexOf(value) !== -1; // Check if the item is checked
			const isTimeChecked = timeChecked.indexOf(value) !== -1; // Check if the item is checked
	
			return (
				<ListItem key={value} secondaryAction={
						<Stack direction="row" spacing={1}>
							{isChecked && (
								<Stack direction={'row'}>
									{isTimeChecked === true && 
										<ResponsiveTimePicker 
											handleSelectedTime={(time) => handleSelectedTime(el, time)} 
											label='muted until...'
										/>}
										<Tooltip title='set timer'>
											<Checkbox
												icon={<AccessTimeIcon />}
												checkedIcon={<WatchLaterIcon />}
												onChange={handleTimeToggle(value)}
												checked={isTimeChecked}
												inputProps={{ 'aria-labelledby': 'no timer' }}
												sx={{color:'#FF5B35', '&.Mui-checked': {color: '#FF5B35'} } }
											/>
										</Tooltip>
								</Stack>
							)}
							<Checkbox
								// edge="start"
								onChange={handleToggle(value)}
								checked={isChecked}
								inputProps={{ 'aria-labelledby': labelId }}
							/>
						</Stack>
					}
					disablePadding
				>
					<ListItemButton>
						<ListItemAvatar>
							<Avatar
							alt={`Avatar of ${el.login}`}
							src={el?.avatar}
							/>
						</ListItemAvatar>
						<ListItemText id={labelId} primary={el.login} />
					</ListItemButton>
				</ListItem>
			);
		})}
		</List>
	);
}
