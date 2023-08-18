/* eslint-disable react-hooks/exhaustive-deps */
import { styled } from '@mui/material/styles';
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
}

export default function SearchBarHighlights({myOptions, handleOptionSelect} : SearchBarHighlightsProps) {

	return (
		<Autocomplete
			id="highlights-demo"
			options={myOptions}
			/* Amina added this block to fix issue 89 : This prop allows us to define a custom comparison function to check if an option matches the value. By default, the Autocomplete component uses strict equality (i.e., ===) for comparison. Given that objects are compared by reference and not by value in JavaScript, you'll encounter problems if the value isn't the exact same object reference as one of the myOptions. */
			isOptionEqualToValue={(option, value) => {
				if ('login' in option && 'login' in value) {
					return option.login === value.login;
				} else if ('name' in option && 'name' in value) {
					return option.name === value.name;
				}
				return false;
			}}
		/* Amina : Fin */
			getOptionLabel={(result) => {
				let title: string | undefined;
				if ('login' in result) {
					// console.log('login in getOptionLabel ', result.login)
					title = result.login;
				} else if ('name' in result) {
					// console.log('name in result  ', result.name)
					title = result.name;
				}
				return title || '';
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