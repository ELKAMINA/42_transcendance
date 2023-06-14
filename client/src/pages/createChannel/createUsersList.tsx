// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../app/store";
// import { userList } from "../../data/userList";
// import React from "react";

// function CreateUsersList() {
// 	const channelUsersList = useSelector((state : RootState) => state.channelUser);

// 	const dispatch = useDispatch();

// 	function handleChannelUsersList(e: React.ChangeEvent<HTMLSelectElement>) {
// 		dispatch({
// 			type: "channelUser/addChannelUser",
// 			payload: userList.find(user => user.name === e.target.value),
// 		})
// 	};

// 	return (
// 	<div className='entry1'>
// 		<label className='form-channel-name' htmlFor='addUsers'>add users</label>
// 		<br></br>
// 		<select
// 		name = "channelUsersList"
// 		id = "channelUsers-select"
// 		onChange={handleChannelUsersList}
// 		>
// 			<option value="default">add users to channel</option>
// 			{
// 				userList.map((user, index) => <option key={`${user.name}-${index}`}>{user.name}</option>)
// 			}
// 		</select>
// 		<div>
// 			{
// 				channelUsersList.map((user, index) => (
// 					<React.Fragment key={`${user.name}-${index}`}>
// 						{index > 0 && <span>&nbsp;&nbsp;&nbsp;-&nbsp;</span>} {/* Display the separator with spaces for all users except the first one */}
// 						{user.name}
// 					</React.Fragment>
// 				)
// 				)
// 			}
// 		</div>
// 	</div>
// 	)
// }

// export default CreateUsersList

import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { userList } from "../../data/userList";


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

  	const channelUsersList = useSelector((state : RootState) => state.channelUser);
	const dispatch = useDispatch();

	const handleChange = (event: SelectChangeEvent<typeof personName>) => {
		// extracting value using destructuring assignment
		// value is the current value of the the select input
		const {target: { value }} = event;

		// setPersonName(
			// On autofill we get a stringified value.
			// typeof value === 'string' ? value.split(',') : value,
		// );

		const updatedPersonName = typeof value === 'string' ? value.split(',') : value;

		setPersonName(updatedPersonName); // Update the state with the new value
	  
		const userName = updatedPersonName.join('');
		
		let input;
		for (let i = 0; i < userList.length; i++) {
			if (userList[i].name === userName){
				input = userList[i];
				console.log("input = ", input.name);
			}
		}

		dispatch({
			type: "channelUser/addChannelUser",
			payload: userList.find(user => user.name === userName),
		})
	};

	return (
		<div>
		<FormControl sx={{ m: 1, width: 300 }}>
			<InputLabel id="demo-multiple-chip-label">select user</InputLabel>
			<Select
			labelId="demo-multiple-chip-label"
			id="demo-multiple-chip"
			multiple
			value={personName}
			onChange={handleChange}
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
			{userList.map((user) => (
				<MenuItem
				key={user.id}
				value={user.name}
				style={getStyles(user.name, personName, theme)}
				>
				{user.name}
				</MenuItem>
			))}
			</Select>
		</FormControl>
		</div>
	);
}