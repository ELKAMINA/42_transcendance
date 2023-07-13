import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import { useDispatch } from "react-redux";
import { Stack } from '@mui/material';
import { UserDetails } from '../../types/users/userType';
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { FetchAllUsers, FetchUsersDb, selectAllUsersInDb, selectSuggestions } from '../../redux-features/friendship/friendshipSlice';


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

export default function MultipleSelectChip() {

	const theme = useTheme();
	const [personName, setPersonName] = React.useState<string[]>([]);

	const dispatch = useDispatch();
	const appDispatch = useAppDispatch();

	const allUsers : UserDetails[] = useAppSelector(selectAllUsersInDb);
	console.log('allUser', allUsers);

	const handleChange = (event: SelectChangeEvent<typeof personName>) => {
		// extracting value using destructuring assignment
		// value is the current value of the the select input
		const {target: { value }} = event;

		setPersonName(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
		
		const newUsers: UserDetails[] = allUsers.filter((user) => value.includes(user.login));
		dispatch({
			type: "channelUser/addChannelUser",
			payload: newUsers,
		})
	};

	return (
		<Box>
			<Stack direction={'column'} spacing={2} alignItems={'center'}>
				<FormControl sx={{ m: 1, width: '100%' }}>
					<InputLabel id="demo-multiple-chip-label">users</InputLabel>
					<Select
						labelId="demo-multiple-chip-label"
						id="demo-multiple-chip"
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
						{allUsers.map((user) => (
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
			</Stack>
		</Box>
	);
}