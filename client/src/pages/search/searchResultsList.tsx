import React from "react";
import "./searchResultsList.css";
import { SearchResult } from "./searchResult";
import { User } from "../../data/userList";

interface SearchResultsListProps {
  results: User[];
}

// this will display the list of all the users whose names matches the input
// results should be an array of Users
export const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <SearchResult result={result.name} key={id} />;
      })}
    </div>
  );
};
