import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import SearchBarHighlights from "./SearchBarHighlight";
import EnterChannelConfirmationDialog from "./EnterChannelConfirmationDialog";

import api from "../utils/Axios-config/Axios";
import AskForPassword from "./AskForPassword";
import { UserByLogin, UserModel } from '../types/users/userType';
import { Channel } from '../types/chat/channelTypes';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks';
import { FetchAllFriends, selectFriends } from '../redux-features/friendship/friendshipSlice';
import { fetchPublicChannels, fetchDisplayedChannel, fetchUserChannels, selectPublicChannels, selectUserChannels } from '../redux-features/chat/channelsSlice';

export type SearchBarContainerProps = {
	getSelectedItem: (item: string) => void;
	newChannelCreated: MutableRefObject<boolean>;

}

export default function SearchBarContainer({ getSelectedItem, newChannelCreated }: SearchBarContainerProps) {

	const [usersAndChannels, setUsersAndChannels] = useState<(Channel | UserModel)[]>([]);
	const [AlertDialogSlideOpen, setAlertDialogSlideOpen] = useState(false);

	const AppDispatch = useAppDispatch();
	// const userChannels : ChannelModel[] = useSelector(selectUserChannels);
	const currentUserName: string = useAppSelector(selectCurrentUser); // get the current user nickname

	useEffect(() => {
		AppDispatch(FetchAllFriends())
		AppDispatch(fetchPublicChannels())
		// AppDispatch(fetchUserChannels())
	}, []); // get the friends and channels from database

	const friends = useAppSelector(selectFriends) as UserModel[];
	let filteredFriends: UserModel[] = [];
	const publicChannels = useAppSelector(selectPublicChannels) as Channel[];
	const userChannels = useAppSelector(selectUserChannels) as Channel[];
	let filteredChannels: Channel[] = [];

	useEffect(() => {
		// STEP #1 ------------------------------------------------------------------------------------------------------------
		// Filter out channels from publicChannels that also exist in userChannels
		const filteredPublicChannels = publicChannels.filter(publicChannel =>
			!userChannels.some(userChannel => publicChannel.name === userChannel.name)
		);
		// concatenate public channels and user channels
		const channels: Channel[] = [...filteredPublicChannels, ...userChannels];

		// STEP #2 ------------------------------------------------------------------------------------------------------------
		// remove the friends that already have an open conversation with the current user
		filteredFriends = friends.filter((friend) => {
			// Find privateConvs where the current user and the friend are the 2 members
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

		// STEP #3 ------------------------------------------------------------------------------------------------------------
		if (channels.length > 0) {
			// 	// #1 : get rid of 'WelcomeChannel'
			filteredChannels = channels
				.filter((channel) => channel.name !== 'WelcomeChannel')
				// 	// #2 : we change the name of the channels for a correct display
				.map((channel) => {
					if (channel.type === 'privateConv') { // if the channel is of type privateConv
						if (channel.members.length >= 2) {
							if (channel.members[0].login === currentUserName) { // if currentUser correspond to members[0], display members[1]'s login
								return { ...channel, name: channel.members[1].login };
							} else {
								return { ...channel, name: channel.members[0].login }; // and vice versa
							}
						}
					}
					return channel; // For other channel types or conditions, keep the channel as is
				});
		}

		// Update usersAndChannels after filtering channels and friends
		setUsersAndChannels([...filteredFriends, ...filteredChannels]);

	}, [publicChannels, userChannels, friends]);

	// State to hold the selected option
	const [selectedOption, setSelectedOption] = useState<Channel | UserModel | null>(null);

	async function createPrivateConv(friend: UserModel) {

		const createdBy: UserByLogin = {
			login: currentUserName,
		};

		const convName = `${createdBy.login}${Date.now()}`;

		try {
			await api
				.post('http://localhost:4001/channel/creation', {
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

		} catch (error: any) {
			console.log('error while creating private conv from search bar = ', error);
		}
	}

	const [openConfirmationDialog, setOpenConfirmationDialog] = useState<boolean>(false);
	const pickedChannel = useRef<Channel>();
	const isConfirmed = useRef<boolean>(false)

	const handleOptionSelect = async (event: React.ChangeEvent<{}>, value: Channel | UserModel | null) => {
		if (value) {
			setSelectedOption(value);
		}
	};

	useEffect(() => {
		if (selectedOption) {
			if ('name' in selectedOption && selectedOption.type === 'privateConv') { // if selectedOption is a private conv
				const conv: Channel | undefined = userChannels.find((channel) => {
					const memberLogin0 = channel.members[0].login;
					const memberLogin1 = channel.members[1].login;
					return ((memberLogin0 === currentUserName && memberLogin1 === selectedOption.name)
						|| (memberLogin0 === selectedOption.name && memberLogin1 === currentUserName))
				})
				if (conv) {
					getSelectedItem(conv.name);
				}
			}
			else if ('name' in selectedOption && selectedOption.type !== 'privateConv') {
				if (selectedOption.members) { // if it is a channel && if it's not a private conv
					if (selectedOption.members.some((member) => member.login === currentUserName)) { // if current user is already a member
						isConfirmed.current = true; // do not open the confirmation dialog box and set confirmed to true
					}
					else { // if current user is not a member of the picked channel
						// update pickedChannel, this will be sent to EnterChannelConfirmationDialog
						pickedChannel.current = selectedOption;

						// open EnterChannelConfirmationDialog
						setOpenConfirmationDialog(true);
					}
				}
			}
			else if ('login' in selectedOption) { // if selected selectedOption is a user
				// check if there is no privateConv for which the user is a member
				if (!userChannels.some(channel => { return channel.type === 'privateConv' && channel.members.some(member => member.login === selectedOption.login); })) {
					createPrivateConv(selectedOption)
				}
			}
		}
	}, [selectedOption])

	useEffect(() => {
		if (selectedOption && 'name' in selectedOption && isConfirmed.current === true) { // if the user do want to enter the channel
			if (selectedOption.pbp === true) { // if channel is protected by a password
				setAlertDialogSlideOpen(true); // open password check dialog slide
			}
			else { // if the channel is not protected by a password
				getSelectedItem(selectedOption.name);
			}
		}
		isConfirmed.current = false; 
	}, [isConfirmed.current, selectedOption])

	return (
		<Box sx={{ width: '95%' }}>
			<SearchBarHighlights myOptions={usersAndChannels} handleOptionSelect={handleOptionSelect} selectOption={usersAndChannels} />
			{selectedOption && 'name' in selectedOption &&
				<AskForPassword
					AlertDialogSlideOpen={AlertDialogSlideOpen}
					setAlertDialogSlideOpen={setAlertDialogSlideOpen}
					getSelectedItem={getSelectedItem}
					element={selectedOption}
				// passwordStatus={passwordStatus}
				/>
			}
			{openConfirmationDialog &&
				<EnterChannelConfirmationDialog
					openDialog={openConfirmationDialog}
					setOpenDialog={setOpenConfirmationDialog}
					selectedChannel={pickedChannel}
					// setIsConfirmed={setIsConfirmed}
					isConfirmed={isConfirmed}
				/>
			}
		</Box>
	);
}