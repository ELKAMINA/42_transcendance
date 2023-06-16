import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

import "./searchBar.css";
import { FetchAllUsers, selectSuggestions} from '../../redux-features/friendship/friendshipSlice';
import { useSelector } from "react-redux";
import { User, userList } from "../../data/userList";
import { RootState } from "../../app/store";
import { Autocomplete, TextField } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../utils/redux-hooks";

function SearchBar({content, setResults }: { content: string; setResults: React.Dispatch<React.SetStateAction<User[]>> }) {	  

	const [input, setInput] = useState<string>('');

	const dispatch = useAppDispatch();

	// when the search component is mounted the first time, get the list of users
	useEffect(() => {dispatch(FetchAllUsers); return () => { console.log('salut')} }, []);

	const allUsers = useAppSelector(selectSuggestions);

	console.log("usersList from backend = ", allUsers);
	
	// this should be done in the backend
	function fetchData(value:string) {

		const results = userList.filter((user: User) => {
		const name = user?.name?.toLowerCase();
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
