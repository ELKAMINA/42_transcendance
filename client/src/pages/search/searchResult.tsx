import { Box } from "@mui/material";
import "./searchResult.css";

export const SearchResult = ({ result }: { result: string }) => {

	// if result is a channel that <login> is a creator/member, display message component
	// if result is a public channel not protected by password, display message component
	// if result is a public channel protected by a password, ask for password than display message component

	// if result is a user that already has an non-empty message_history  with <login>, open message component
	// if result is a user that has an empty message_history with <login>, open user profile
	
	return (
		<Box
		className="search-result"
		onClick={() => alert(`You selected ${result}!`)}
		>
		{result}
		</Box>
	);
};