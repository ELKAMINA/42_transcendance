import { Box } from "@mui/material";
import "./searchResult.css";
import { useAppDispatch } from "../../utils/redux-hooks";
import { useSelector } from "react-redux";
import { fetchDisplayedChannel, fetchUserChannels, selectAllChannels, selectDisplayedChannel } from "../../redux-features/chat/channelsSlice";
import { selectFriends, selectSuggestions } from "../../redux-features/friendship/friendshipSlice";
import { UserDetails } from "../../types/users/userType";
import { Channel } from "../../types/chat/channelTypes";
import { selectCurrentUser } from "../../redux-features/auth/authSlice";
import api from "../../utils/Axios-config/Axios";

export const SearchResult = ({ result }: { result: string }) => {
	const AppDispatch = useAppDispatch();
	const channels = useSelector(selectAllChannels) as Channel[];
	const users = useSelector(selectSuggestions) as UserDetails[];
	const friends = useSelector(selectFriends) as UserDetails[];
	const currentuser = useSelector(selectCurrentUser);

	const channel = channels.find(channel => channel.name === result); 
	const user = users.find(user => user.login === result);

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
			protected_by_password: false,
			key: '',
			members: [user],
			avatar: user?.avatar,
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

		else if (user) {
			// const isFriend = friends.find(friend => friend.login === currentuser); // TODO 
			const isFriend = 'true';
			if (isFriend) {
				createPrivateConv();
			}
			else
				console.log('go to user profile page!') // TODO
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