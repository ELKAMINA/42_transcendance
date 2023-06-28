import SearchIcon from '@mui/icons-material/Search';
import "./searchBar.css";

import { FetchAllUsers, selectSuggestions} from '../../redux-features/friendship/friendshipSlice';
// import { User } from "../../../../server/src/user/types/user-types.user.ts";
import { UserDetails } from "../../types/users/userType";
import { useAppDispatch, useAppSelector } from "../../utils/redux-hooks";
import { useEffect, useState } from 'react';
import { fetchAllChannelsInDatabase, selectAllChannels } from '../../redux-features/chat/channelsSlice';
import { Channel } from '../../types/chat/chatTypes';

function SearchBar({content, setResults }: { content: string; setResults: React.Dispatch<React.SetStateAction<(UserDetails | Channel)[] >> }) {	  

	const [input, setInput] = useState<string>('');

	const dispatch = useAppDispatch();

	// when the search component is mounted the first time, get the list of users
	useEffect(() => {dispatch(FetchAllUsers())}, []);
	const allUsers: UserDetails[] = useAppSelector((state) => selectSuggestions(state) as UserDetails[]);
	
	useEffect(() => {dispatch(fetchAllChannelsInDatabase())}, []);
	const channels = useAppSelector((state) => selectAllChannels (state)) as Channel[];
	
	const usersAndChannels = [...allUsers, ...channels];

	function fetchData(value:string) {
		const results = usersAndChannels.filter((item) => {
			// const name = user?.login?.toLowerCase();
			// return value && user && name && name.includes(value);
			if ('login' in item) {
				const name = (item as UserDetails).login?.toLowerCase();
				return value && name && name.includes(value);
			} else if ('name' in item) {
				const name = (item as Channel).name?.toLowerCase();
				return value && name && name.includes(value);
			}
			return false;
		});
		setResults(results);
	}

	function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setInput(value);
		fetchData(value);
	}

	return (
		<div className="input-wrapper">
			<SearchIcon id="search-icon" />
			<input
				className="input"
				placeholder={content}
				value={input}
				onChange={handleSearch}
			/>
	  	</div>
	);
	};

export default SearchBar;
