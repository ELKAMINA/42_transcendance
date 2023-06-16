import React from "react";
import "./searchResultsList.css";
import { SearchResult } from "./searchResult";
import { UserDetails } from "../../../../server/src/user/types/user-types.user.ts";


interface SearchResultsListProps {
  results: UserDetails[];
}

// this will display the list of all the users whose names matches the input
// results should be an array of Users
const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <SearchResult result={result.login} key={id} />;
      })}
    </div>
  );
};

export default SearchResultsList