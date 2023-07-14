import React from "react";
import "./searchResultsList.css";
import { SearchResult } from "./searchResult";
import { UserDetails } from "../../../../server/src/user/types/user-types.user.ts";
import { Channel } from "../../types/chat/channelTypes.ts";


interface SearchResultsListProps {
  	results: (UserDetails | Channel)[];
	getSelectedItem: (item: string) => void;
}

// this will display the list of all the users whose names matches the input
// results should be an array of Users
const SearchResultsList: React.FC<SearchResultsListProps> = ({ results, getSelectedItem } : SearchResultsListProps) => {
  return (
    <div className="results-list">
		{results.map((result, id) => {
			let name: string | undefined;
	
			if ('login' in result) {
				name = result.login;
			} else if ('name' in result) {
				name = result.name;
			}
	
			return name ? <SearchResult result={name} key={id} getSelectedItem={getSelectedItem}/> : null;
		})}

    </div>
  );
};

export default SearchResultsList