import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { UserByLogin } from '../../types/users/userType';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';

/*** ISSUE 110 ***/
// HANDLE ERROR ON WHOLE createChannel COMPONENT
import { useEffect } from "react";
import {
	setUserListErrorState,
} from "../../redux-features/chat/createChannel/createChannelErrorSlice";
import { selectFriends } from '../../redux-features/friendship/friendshipSlice';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export type MultipleSelectChipProps = {
	userList? : UserByLogin[],
	setUpdatedMembers? : (members : UserByLogin[]) => void,
}

export default function MultipleSelectChip({userList, setUpdatedMembers} : MultipleSelectChipProps) {
	const theme = useTheme();
	const [personName, setPersonName] = React.useState<string[]>([]);
	const userFriends = useAppSelector(selectFriends) as UserByLogin[];
	const [simplifiedFriends, setSimplifiedFriends] = React.useState<UserByLogin[]>([]);

	useEffect(() => {
		const simplified = userFriends.map(({ login }) => ({ login }));
		setSimplifiedFriends(simplified);
	}, [userFriends])

	useEffect(() => {
		if (userList) {
			setSimplifiedFriends(userList);
		}
	}, [userList])

	const dispatch = useAppDispatch();

	/*** ISSUE 110 ***/
	useEffect(() => {
		if (personName.length <= 0) {
			dispatch(setUserListErrorState(true));
		} else {
			dispatch(setUserListErrorState(false));
		}
	}, [personName, dispatch])

	const handleChange = (event: SelectChangeEvent<typeof personName>) => {
		// extracting value using destructuring assignment
		// value is the current value of the the select input
		const {target: { value }} = event;

		setPersonName(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
		
		const newUsers: UserByLogin[] = simplifiedFriends.filter((user) => value.includes(user.login));
		dispatch({
			type: "channelUser/addChannelUser",
			payload: newUsers,
		})

		if (setUpdatedMembers)
			setUpdatedMembers(newUsers);
	};

	return (
		<Box width={'100%'}>
			<FormControl sx={{width: '100%' }}>
				<InputLabel id="multiple-chip-label">users *</InputLabel>
				<Select
					labelId="multiple-chip-label"
					id="multiple-chip"
					multiple
					required
					value={personName}
					onChange={handleChange}
					sx={{width: '100%',}}
					input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
					renderValue={(selected) => (
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
						{selected.map((value) => (
							<Chip key={value} label={value} />
						))}
						</Box>
					)}
					MenuProps={MenuProps}
				>
					{simplifiedFriends.map((user) => (
						<MenuItem
						key={user.login}
						value={user.login}
						style={getStyles(user.login, personName, theme)}
						>
						{user.login}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			{(simplifiedFriends.length === 0) && <Typography variant='body1' sx={{color: 'red'}}> No friend found! </Typography>}
		</Box>
	);
}