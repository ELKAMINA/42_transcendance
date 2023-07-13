import { Box } from "@mui/material";
import "./searchResult.css";
import { useAppDispatch, useAppSelector } from "../../utils/redux-hooks";
import { useSelector } from "react-redux";
import { fetchDisplayedChannel, fetchUserChannels, selectAllChannels, selectDisplayedChannel, selectUserChannels } from "../../redux-features/chat/channelsSlice";
import { selectFriends, selectSuggestions } from "../../redux-features/friendship/friendshipSlice";
import { UserDetails } from "../../types/users/userType";
import { Channel } from "../../types/chat/channelTypes";
import { selectCurrentUser } from "../../redux-features/auth/authSlice";
import api from "../../utils/Axios-config/Axios";

export const SearchResult = ({ result }: { result: string }) => {
	const AppDispatch = useAppDispatch();
	const channels = useAppSelector(selectAllChannels) as Channel[];
	const userChannels : Channel[] = useSelector(selectUserChannels);
	const friends = useAppSelector(selectFriends) as UserDetails[];
	const currentuser = useAppSelector(selectCurrentUser);

	const channel = channels.find(channel => channel.name === result);
	// console.log('channel = ', channel);
	const friend = friends.find(friend => friend.login === result);
	// console.log('friend =', friend);

	async function createPrivateConv() {

		const createdBy : UserDetails = {
			login : currentuser, 
			displayName : currentuser, 
			email: 'dumdum@dum.dum', 
			avatar : ''
		};

		await api
		.post ('http://localhost:4001/channel/creation', {
			name: result,
			channelId: Date.now(),	
			type: 'privateConv',
			createdBy: createdBy,
			admins: [createdBy],
			protected_by_password: false,
			key: '',
			members: [friend],
			avatar: friend?.avatar,
			chatHistory: [],
		})
		.then ((response) => {
			// console.log('this channel has been added to the database = ', response);
			AppDispatch(fetchUserChannels());
			AppDispatch(fetchDisplayedChannel(result));
		})
		.catch ((error) => {
			console.log('error = ', error);
		})
	}

	function onClick() {
		if (channel) {
			if (channel.type === 'privateConv' 
				|| (channel.type === 'private' && (channel.createdBy.login === currentuser || channel.members?.find(member => member.login === currentuser))) 
				|| channel.type === 'public')
				AppDispatch(fetchDisplayedChannel(result));
			if (channel.key !== '')
				console.log('needs password!');
		}
		// if selected result is a user, create a new conv if does not exist, or go to existing conv
		else if (friend) {
			if (!userChannels.some(channel => channel.name === friend.login)) {
				createPrivateConv();
			}
			else {
				// console.log('you already have a conversation with ', friend.login)
				AppDispatch(fetchDisplayedChannel(result));
			}
		}
	}
	
	return (
		<Box
			className="search-result"
			onClick={onClick}
		>
		{result}
		</Box>
	);
};