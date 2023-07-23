import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { UserModel } from '../types/users/userType';
import { useAppSelector } from '../utils/redux-hooks';
import { Channel, ChannelModel } from '../types/chat/channelTypes';
import { selectDisplayedChannel } from '../redux-features/chat/channelsSlice';

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

  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {usersSet.map((el, value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem
            key={value}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(value)}
                checked={checked.indexOf(value) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
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
