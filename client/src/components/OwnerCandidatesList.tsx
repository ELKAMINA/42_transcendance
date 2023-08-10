import * as React from 'react';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import { UserModel } from '../types/users/userType';
import { useAppSelector } from '../utils/redux-hooks';
import { ChannelModel } from '../types/chat/channelTypes';
import { selectDisplayedChannel } from '../redux-features/chat/channelsSlice';

type OwnerCandidatesListProps = {
	setUpdatedOwner : (owner : UserModel | null) => void,
}

export default function OwnerCandidatesList({setUpdatedOwner} : OwnerCandidatesListProps) {
	const selectedChannel : ChannelModel = useAppSelector((state) => selectDisplayedChannel(state));
	const channelMembers : UserModel[] = selectedChannel.members;

	const ownerIndex : number = channelMembers.findIndex(member => selectedChannel.ownedById === member.login);

	const [checked, setChecked] = React.useState<number>(ownerIndex);

	const handleToggle = (value: number) => () => {
		
		const currentIndex = value;
		let newChecked = checked;

		if (currentIndex === checked) {
			// If the clicked checkbox is already checked, uncheck it by setting newChecked to -1
			newChecked = -1;
		  } else {
			// If the clicked checkbox is not checked, check it by setting newChecked to its value
			newChecked = value;
		  }

    	setChecked(newChecked);
		const updatedOwner: UserModel | null = newChecked !== -1 ? channelMembers[newChecked] : null;
		setUpdatedOwner(updatedOwner);
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
                checked={value === checked}
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
