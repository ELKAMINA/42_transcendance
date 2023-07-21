import SearchBarHighlights from "./SearchBarHighlight";

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { FetchAllFriends, selectFriends } from '../redux-features/friendship/friendshipSlice';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { fetchAllChannelsInDatabase, fetchDisplayedChannel, fetchUserChannels, selectAllChannels, selectUserChannels } from '../redux-features/chat/channelsSlice';
import { Channel, ChannelModel } from '../types/chat/channelTypes';
import { UserByLogin, UserModel } from '../types/users/userType';
import { Box } from "@mui/material";
import AskForPassword from "./AskForPassword";
import { emptyChannel } from "../data/emptyChannel";
import { useSelector } from "react-redux";
import api from "../utils/Axios-config/Axios";

export type SearchBarContainerProps = {
	getSelectedItem: (item: string) => void;
}

export default function SearchBarContainer({getSelectedItem} : SearchBarContainerProps) {

	const [usersAndChannels, setUsersAndChannels] = useState<(Channel | UserModel)[]>([]);
	const [AlertDialogSlideOpen, setAlertDialogSlideOpen] = useState(false);

	const AppDispatch = useAppDispatch();
	const userChannels : ChannelModel[] = useSelector(selectUserChannels);
	const currentUserName : string = useAppSelector(selectCurrentUser); // get the current user nickname

	useEffect(() => {
		AppDispatch(FetchAllFriends())
		AppDispatch(fetchAllChannelsInDatabase())
	}, [AppDispatch]); // get the friends and channels from database

	const friends = useAppSelector(selectFriends) as UserModel[];
	let channels = useAppSelector((state) => selectAllChannels(state)) as Channel[];
	channels = channels.filter(channel => channel.name !== 'WelcomeChannel'); // remove 'WelcomeChannel'
	let filteredChannels : Channel[] = [];
	
	// if the channel is of type 'private'or 'privateConv' and the current user is not a member,
	// we won't display it.
	// so I filter all the private channels and privateConv channels of which I am not a member or
	// a creator.
	useEffect(() => {
		if (channels.length > 0) {
			filteredChannels = channels.filter((channel) => {
				if (channel.type === 'privateConv' || channel.type === 'private') {
					return (
						channel.members.some(
							(member) => member?.login === currentUserName
						) ||
						channel.createdBy?.login === currentUserName
					);
				}
				return true;
			});

			// remove the friends that already have an open conversion with current user to avoid duplicates
			const filteredFriends = friends.filter((friend) => {
				return channels.every((channel) => channel.name !== friend.login); // If any match is found, the every method will return false, and the friend will be excluded from the filteredFriends array.
			})

			setUsersAndChannels([...filteredFriends, ...filteredChannels]); // join friends and channels
		}
	}, []);

	// State to hold the selected option
	const [selectedOption, setSelectedOption] = useState<Channel | UserModel | null >(null);

	async function createPrivateConv(friend : UserModel) {

		const createdBy : UserByLogin = {
			login : currentUserName, 
		};

		await api
		.post ('http://localhost:4001/channel/creation', {
			name: friend.login,
			channelId: Date.now(),	
			type: 'privateConv',
			createdBy: createdBy,
			admins: [createdBy],
			protected_by_password: false,
			key: '',
			members: [friend, createdBy],
			avatar: friend?.avatar,
			chatHistory: [],
		})
		.then ((response) => {
			// console.log('this channel has been added to the database = ', response);
			AppDispatch(fetchUserChannels());
			AppDispatch(fetchDisplayedChannel(friend.login));
		})
		.catch ((error) => {
			console.log('error = ', error);
		})
	}

	// Event handler to log the selected option
	const handleOptionSelect = (event: React.ChangeEvent<{}>, value: Channel | UserModel | null) => {
		if (value) {
		
			setSelectedOption(value);
			if ('name' in value ) { // if it is a channel
				if (value.key !== '') { // if channel is protected by a password
					setAlertDialogSlideOpen(true); // open password check dialog slide
				}
				else {
					AppDispatch(fetchDisplayedChannel(value.name));
					// getSelectedItem(value.name);
				}
			}
			else if ('login' in value) { // if selected value is a user
				if (!userChannels.some(channel => channel.name === value.login)) {
					createPrivateConv(value);
				}
				else {
					AppDispatch(fetchDisplayedChannel(value.login));
					// getSelectedItem(value.name);
				}
			}
		}
	};


	return (
		<Box sx={{width: '95%'}}>
			<SearchBarHighlights myOptions={usersAndChannels} handleOptionSelect={handleOptionSelect}/>
			{ selectedOption && 'name' in selectedOption && 
				<AskForPassword
					AlertDialogSlideOpen={AlertDialogSlideOpen}
					setAlertDialogSlideOpen={setAlertDialogSlideOpen}
					getSelectedItem={getSelectedItem}
					element={selectedOption}
				/>
			}
		</Box>
	);
}