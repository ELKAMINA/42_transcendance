import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

import "./searchBar.css";
// import Search from "./search";
// import SearchIconWrapper from "./searchIconWrapper";
// import StyledInputBase from "./styledInputBase";
import { userList, User } from "../../data/userList";

function SearchBar({ setResults }: { setResults: React.Dispatch<React.SetStateAction<User[]>> }) {  
	
	const [input, setInput] = useState<string>('');

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
				placeholder="Type to search..."
				value={input}
				onChange={handleSearch}
			/>
	  	</div>
	);
	};

export default SearchBar;
