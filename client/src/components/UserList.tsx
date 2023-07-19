import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { UserByLogin, UserModel } from '../types/users/userType';
import { useAppSelector } from '../utils/redux-hooks';
import { Channel } from '../types/chat/channelTypes';
import { selectDisplayedChannel } from '../redux-features/chat/channelsSlice';

type UserListProps = {
	updatedAdmins? : UserByLogin[],
	setUpdatedAdmins : (admins : UserByLogin[]) => void,
}

export default function UserList({setUpdatedAdmins} : UserListProps) {
	const selectedChannel : Channel = useAppSelector((state) => selectDisplayedChannel(state));
	const channelAdmins : UserByLogin[] = selectedChannel.admins;
	const channelMembers : UserByLogin[] = selectedChannel.members;

	const adminIndexes: number[] = channelAdmins.map((admin) =>
		channelMembers.findIndex((member) => member.login === admin.login)
	);

	const [checked, setChecked] = React.useState<number[]>(adminIndexes[0] === -1 ? [0] : adminIndexes);

	const handleToggle = (value: number) => () => {
		
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];
	
		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
	    }

    	setChecked(newChecked);
		const updatedAdmins: UserByLogin[] = [selectedChannel.createdBy, ...newChecked.map((index) => channelMembers[index])];
		setUpdatedAdmins(updatedAdmins);
  	};

  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {channelMembers.map((el, value) => {
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
