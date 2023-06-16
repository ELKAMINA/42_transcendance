import SearchIcon from '@mui/icons-material/Search';
import "./searchBar.css";

import { FetchAllUsers, selectSuggestions} from '../../redux-features/friendship/friendshipSlice';
// import { User } from "../../../../server/src/user/types/user-types.user.ts";
import { UserDetails } from "../../../../server/src/user/types/user-types.user.ts";
import { useAppDispatch, useAppSelector } from "../../utils/redux-hooks";
import { useEffect, useState } from 'react';

function SearchBar({content, setResults }: { content: string; setResults: React.Dispatch<React.SetStateAction<UserDetails[]>> }) {	  

	const [input, setInput] = useState<string>('');

	const dispatch = useAppDispatch();

	// when the search component is mounted the first time, get the list of users
	useEffect(() => {dispatch(FetchAllUsers())}, []);

	// const allUsers:UserDetails[] = useAppSelector(selectSuggestions);
	const allUsers: UserDetails[] = useAppSelector((state) => selectSuggestions(state) as UserDetails[]);

	console.log("usersList from backend = ", allUsers);
	
	// this should be done in the backend
	function fetchData(value:string) {

		const results = allUsers.filter((user) => {
		const name = user?.login?.toLowerCase();
		return value && user && name && name.includes(value);
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
