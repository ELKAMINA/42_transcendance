/* eslint-disable react-hooks/exhaustive-deps */
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { FetchAllFriends, selectFriends } from '../redux-features/friendship/friendshipSlice';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { fetchAllChannelsInDatabase, selectAllChannels } from '../redux-features/chat/channelsSlice';
import { Channel } from '../types/chat/channelTypes';
import { InputAdornment } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { UserModel } from '../types/users/userType';


const CssTextField = styled(TextField)({
	'& label': {
		color: 'white',
	},
	'& label.Mui-focused': {
	  color: 'white',
	},
	'& .MuiInput-underline:after': {
	  borderBottomColor: 'red',
	},
	'& .MuiOutlinedInput-root': {
		backgroundColor: '#032B50', // this target the background of the 'outlined input' element

		'& fieldset': {
			borderWidth: '2px',
			borderColor: 'white',
		},
		'&:hover fieldset': {
			borderWidth: '2px',
			borderColor: '#99E100',
		},
		'&.Mui-focused fieldset': {
			borderWidth: '2px',
			borderColor: 'white',
		},
	},
	'& .MuiInputBase-input': { // This targets the input text
		color: 'white',
		backgroundColor: '#032B50',
	},

});

export default function SearchBarHighlights() {

	const [usersAndChannels, setUsersAndChannels] = useState<(Channel | UserModel)[]>([]);
	const dispatch = useAppDispatch();

	const currentUserName : string = useAppSelector(selectCurrentUser); // get the current user nickname

	useEffect(() => {dispatch(FetchAllFriends())}, [dispatch]); // get the friends from database
	const friends = useAppSelector(selectFriends) as UserModel[];
	// console.log('friends = ', friends);

	useEffect(() => {dispatch(fetchAllChannelsInDatabase())}, []); // get the channels from db
	let channels = useAppSelector((state) => selectAllChannels(state)) as Channel[];
	channels = channels.filter(channel => channel.name !== 'WelcomeChannel'); // remove 'WelcomeChannel'
	let filteredChannels : Channel[] = [];

	// if the channel is of type 'private'or 'privateConv' and the current user is not a member,
	// we won't display it.
	// so I filter all the private channels and privateConv channels of which I am not a member or
	// a creator.
	// console.log('channels.length = ', channels.length);
	useEffect(() => {
		if (channels.length > 1) {
			filteredChannels = channels.filter((channel) => {
				if (channel.type === 'privateConv' || channel.type === 'private') {
					return (
						channel.members.some(
							(member) => member?.login === currentUserName
						) ||
						channel.createdBy?.login === currentUserName
					);
				}
				return true;
			});
			setUsersAndChannels([...friends, ...filteredChannels]); // join friends and channels
		}
	}, []);
	return (
		<Autocomplete
			id="highlights-demo"
			sx={{ 
				width: '95%',
				'& .MuiAutocomplete-inputRoot': {
					backgroundColor: 'white',
					color: 'white',
				},
				'& .MuiAutocomplete-input': {
					backgroundColor: 'white',
					boxShadow: 'none',
					color: 'white',
				},
				'& .MuiAutocomplete-inputFocused': {
					backgroundColor: 'white',
					boxShadow: 'none',
					color: '#032B50',
				},
				'& .MuiAutocomplete-endAdornment': {	
					position: 'end', 	
				},
			}}
			options={usersAndChannels}
			getOptionLabel={(result) => {
				let title: string | undefined;
				if ('login' in result) {
					title = result.login;
				} else if ('name' in result) {
					title = result.name;
				}
				return title || '';
			}}
			renderInput={(params) => (
				<CssTextField {...params} label="search for channel or user" 
					// type='search'
					// variant='filled'
					margin="normal" 
					InputLabelProps={{
						sx: {
							color: '#032B50',
							textTransform: 'full-width',
						},
					}}
				/>
			)}
			renderOption={(props, result, { inputValue }) => {
				let title : string | undefined = '';
				if ('login' in result) {
					title = result.login;
				} else if ('name' in result) {
					title = result.name;
				}
				const matches = match(title, inputValue, { insideWords: true });
				const parts = parse(title, matches);
				return (
					<li {...props}>
						<div>
						{parts.map((part, index) => (
							<span
							key={index}
							style={{
								fontWeight: part.highlight ? 700 : 400,
							}}
							>
								{part.text}
							</span>
						))}
						</div>
					</li>
				);
			}}
		/>
  );
}