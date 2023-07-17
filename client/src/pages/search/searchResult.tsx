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
import AskForPassword from "../../components/AskForPassword";
import { useState } from "react";
import { emptyChannel } from "../../data/emptyChannel";

type SearchResultProps = {
	result: string ;
	getSelectedItem: (item: string) => void;
}

export const SearchResult = ({ result, getSelectedItem }: SearchResultProps) => {

	const [AlertDialogSlideOpen, setAlertDialogSlideOpen] = useState(false);

	const AppDispatch = useAppDispatch();
	const channels = useAppSelector(selectAllChannels) as Channel[];
	const userChannels : Channel[] = useSelector(selectUserChannels);
	const friends = useAppSelector(selectFriends) as UserDetails[];
	const currentuser = useAppSelector(selectCurrentUser);

	const channel = channels.find(channel => channel.name === result); // find result in the list of channels
	const friend = friends.find(friend => friend.login === result); // find result in the list of friends

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
		if (channel) { // if it is a channel
			if (channel.key !== '') { // if channel is protected by a password
				setAlertDialogSlideOpen(true); // open password check dialog slide
			}
			else {
				AppDispatch(fetchDisplayedChannel(result));
				// getSelectedItem(result);
			}
		}
		else if (friend) { // if selected result is a user
			if (!userChannels.some(channel => channel.name === friend.login)) { 
				createPrivateConv();
			}
			else {
				AppDispatch(fetchDisplayedChannel(result));
				// getSelectedItem(result);
			}
		}
	}
	
	const PasswordCheckChannel : Channel = channels.find(channel => channel.name === result) || emptyChannel;
	return (
		<Box>
			<Box
				className="search-result"
				onClick={onClick}
			>
			{result}
			</Box>
			<AskForPassword
				AlertDialogSlideOpen={AlertDialogSlideOpen}
				setAlertDialogSlideOpen={setAlertDialogSlideOpen}
				getSelectedItem={getSelectedItem}
				element={PasswordCheckChannel}
			/>
		</Box>
	);
};