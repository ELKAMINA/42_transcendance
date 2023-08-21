import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import React, { MutableRefObject, useEffect, useState } from 'react'
import SearchBarHighlights from "./SearchBarHighlight";
import EnterChannelConfirmationDialog from "./EnterChannelConfirmationDialog";

import api from "../utils/Axios-config/Axios";
import AskForPassword from "./AskForPassword";
import { UserByLogin, UserModel } from '../types/users/userType';
import { Channel, ChannelModel } from '../types/chat/channelTypes';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { FetchAllFriends, selectFriends } from '../redux-features/friendship/friendshipSlice';
import { fetchAllChannelsInDatabase, fetchDisplayedChannel, fetchUserChannels, selectAllChannels, selectUserChannels } from '../redux-features/chat/channelsSlice';

export type SearchBarContainerProps = {
	getSelectedItem: (item: string) => void;
	newChannelCreated: MutableRefObject<boolean>;

}

export default function SearchBarContainer({getSelectedItem, newChannelCreated} : SearchBarContainerProps) {

	const [usersAndChannels, setUsersAndChannels] = useState<(Channel | UserModel)[]>([]);
	const [AlertDialogSlideOpen, setAlertDialogSlideOpen] = useState(false);

	const AppDispatch = useAppDispatch();
	const userChannels : ChannelModel[] = useSelector(selectUserChannels);
	const currentUserName : string = useAppSelector(selectCurrentUser); // get the current user nickname

	useEffect(() => {
		AppDispatch(FetchAllFriends())
		AppDispatch(fetchAllChannelsInDatabase())
	}, []); // get the friends and channels from database

	const friends = useAppSelector(selectFriends) as UserModel[];
	let filteredFriends : UserModel[] = [];
	let channels = useAppSelector((state) => selectAllChannels(state)) as Channel[];
	let filteredChannels : Channel[] = [];

	// if the channel is of type 'private' or 'privateConv' and the current user is not a member,
	// we won't display it.
	// so I filter all the private channels and privateConv channels of which I am not a member or
	// a creator.
    useEffect(() => {
		// console.log('friends = ', friends);
		// console.log('channels = ', channels);

		// remove the friends that already have an open conversation with the current user to avoid duplicates
		// I need to check if the channel is of type 'privateConv'
		// Then I need to check if the friend and I are the two members
		// I this is true : filter out
		filteredFriends = friends.filter((friend) => {
			// Find channels where the current user and the friend are members and the type is 'privateConv'
			let existingChannels = channels.filter((channel) => {
				return (
					channel.type === 'privateConv' &&
					channel.members.some(member => member.login === currentUserName) &&
					channel.members.some(member => member.login === friend.login)
				);
			});
		
			// If no existing channels were found, keep the friend in the list
			return existingChannels.length === 0;
		});

		// console.log('filteredFriends = ', filteredFriends);

		if (channels.length > 0) {

			// #1 : we filter out all the private channels and privateConvs that don't have currentUser as a member
			filteredChannels = channels
			.filter((channel) => { 
				if (channel.type === 'privateConv' || channel.type === 'private') {
					return (
						channel.members.some((member) => member?.login === currentUserName)  // checks if there's at least one member in the members array of the channel whose login property matches the currentUserName
					);
				}
				if (channel.name === 'WelcomeChannel')
					return false;
				return true;
			})
			// #2 : we change the name of the channels for a correct display
			.map((channel) => {
				if (channel.type === 'privateConv') { // if the channel is of type privateConv
					if (channel.members[0].login === currentUserName) { // if currentUser correspond to members[0], display members[1]'s login
						return { ...channel, name: channel.members[1].login };
					} else {
						return { ...channel, name: channel.members[0].login }; // and vice versa
					}
				}
				return channel; // For other channel types or conditions, keep the channel as is
			  });
		}

		// console.log('filteredChannels = ', filteredChannels);

		// Update usersAndChannels after filtering channels and friends
		setUsersAndChannels([...filteredFriends, ...filteredChannels]);

    }, [friends, channels]);

	// State to hold the selected option
	const [selectedOption, setSelectedOption] = useState<Channel | UserModel | null>(null);

	async function createPrivateConv(friend : UserModel) {

		const createdBy : UserByLogin = {
			login : currentUserName, 
		};

		const convName = `${createdBy.login}${Date.now()}`;
		
		try {
			await api
			.post ('http://localhost:4001/channel/creation', {
				name: convName,
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

			await AppDispatch(fetchUserChannels());
			await AppDispatch(fetchDisplayedChannel(convName));

			newChannelCreated.current = true;
			getSelectedItem(convName);

		} catch (error : any) {
			console.log('error while creating private conv from search bar = ', error);
		}
	}

	const [openConfirmationDialog, setOpenConfirmationDialog] = useState<boolean>(false);
	const [pickedChannel, setPickedChannel] = useState<Channel>();
	const [isConfirmed, setIsConfirmed] = useState<boolean>();

	// Event handler to log the selected option
	const handleOptionSelect = async (event: React.ChangeEvent<{}>, value: Channel | UserModel | null) => {
		if (value) {
			setSelectedOption(value);

			if ('name' in value && value.type === 'privateConv') { // if value is a private conv
				const conv : ChannelModel | undefined = userChannels.find((channel) => {
					const memberLogin0 = channel.members[0].login;
					const memberLogin1 = channel.members[1].login;
					return ((memberLogin0 === currentUserName && memberLogin1 === value.name) 
						|| (memberLogin0 === value.name && memberLogin1 === currentUserName)) 
				})

				// console.log("[SearchBarContainer] channelName = ", conv?.name);
				if (conv) {
					AppDispatch(fetchDisplayedChannel(conv.name))
					// getSelectedItem(conv.name);
				}
			}
			else if ('name' in value && value.type !== 'privateConv') { // if it is a channel && if it's not a private conv
				console.log("[searchbar] coucou");
				if (value.members.some((member) => member.login === currentUserName)) { // if current user is already a member
					setIsConfirmed(true) // do not open the confirmation dialog box and set confirmed to true
				}
				else { // if current user is not a member of the picked channel
					// update pickedChannel, this will be sent to EnterChannelConfirmationDialog
					setPickedChannel(value);
					// open EnterChannelConfirmationDialog
					setOpenConfirmationDialog(true);
				}
				if (isConfirmed) { // if the user do want to enter the channel
					if (value.key !== '') { // if channel is protected by a password
						setAlertDialogSlideOpen(true); // open password check dialog slide
					}
					else { // if the channel is not protected by a password
						// getSelectedItem(value.name);
						AppDispatch(fetchDisplayedChannel(value.name))
					}
				}
			}
			else if ('login' in value) { // if selected value is a user
				if (!userChannels.some(channel => { // check if there is no privateConv for which the user is a member
					return channel.type === 'privateConv' &&
						channel.members.some(member => member.login === value.login);
				})) {
					await createPrivateConv(value);
				}
				else {
					console.log("YOU SHOULD NOT EVER SEE THIS");
					AppDispatch(fetchDisplayedChannel(value.login))
					// getSelectedItem(value.login);
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
			{ openConfirmationDialog &&
				<EnterChannelConfirmationDialog 
					openDialog={openConfirmationDialog}
					setOpenDialog={setOpenConfirmationDialog}
					selectedChannel={pickedChannel}
					setIsConfirmed = {setIsConfirmed}
				/>
			}
		</Box>
	);
}