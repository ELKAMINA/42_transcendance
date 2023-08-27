/* eslint-disable react-hooks/exhaustive-deps */
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { Channel } from '../types/chat/channelTypes';
import { UserModel } from '../types/users/userType';


const CssTextField = styled(TextField)({
	'& label': {
		color: 'white',
	},
	'& label.Mui-focused': {
	  color: 'white',
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
		boxShadow: 'none',
	},

});

export type SearchBarHighlightsProps = {
	myOptions : (Channel | UserModel)[];
	handleOptionSelect : (event: React.ChangeEvent<{}>, optionSelected : Channel | UserModel | null) => void;
	selectOption: (Channel | UserModel)[];
}

export default function SearchBarHighlights({myOptions, handleOptionSelect, selectOption} : SearchBarHighlightsProps) {

	useEffect(() => {
		// console.slog('selected options ', selectOption)
		console.log('My options ', myOptions)
	}, [myOptions])
	return (
		<Autocomplete
			id="highlights-demo"
			options={myOptions}
			getOptionLabel={(result) => {
				let title: string | undefined;
				// console.log('result', result)
				if ('login' in result) {
					title = result.login;
				} else if ('name' in result) {
					// console.log('name in result  ', result.name)
					title = result.name;
				}
				return title || '';
			}}
			isOptionEqualToValue={(option, value) => {
				if ('login' in option && 'login' in value){
					// console.log('1 --option ', option)
					// console.log('2 --value ', value)
					return option.login === value.login;
				}
				else if ('name' in option && 'name' in value){
					// console.log('3 --option ', option)
					// console.log('4 --value ', value)
						return option.name === value.name;
				} else if ('name' in option && 'login' in value){
					// console.log('je rentre ici')
					return option.name === value.login;
				}
				else
					return false
			}}
			onChange={handleOptionSelect}
			renderInput={(params) => ( <CssTextField {...params} label="search for channel or user" margin="normal" /> )}
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
					<li key={`option-${myOptions.indexOf(result)}`} {...props}>
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