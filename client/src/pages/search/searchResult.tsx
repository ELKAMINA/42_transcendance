import "./searchResult.css";

export const SearchResult = ({ result }: { result: string }) => {
  return (
    <div
      className="search-result"
      onClick={() => alert(`You selected ${result}!`)}
    >
      {result}
    </div>
  );
};