import "./createChannel.css"

import React, { MutableRefObject, useEffect } from "react";
import { IconButton } from "@mui/material";
import { Box, Button, Stack } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

import CreateName from "./createName";
import { RootState } from '../../app/store';
import CreateType from "./createChannelType";
import CreateUsersList from "./createUsersList";
import api from '../../utils/Axios-config/Axios' 
import { UserByLogin } from "../../types/users/userType";
import { useAppDispatch, useAppSelector } from "../../utils/redux-hooks";
import { fetchPublicChannels, fetchUserChannels, setIsPopupOpen } from "../../redux-features/chat/channelsSlice";
import { resetChannelUser } from "../../redux-features/chat/createChannel/channelUserSlice";
import { resetChannelName } from "../../redux-features/chat/createChannel/channelNameSlice";
import { FetchUsersDb, selectFriends } from "../../redux-features/friendship/friendshipSlice";
import { ChannelTypeState, resetChannelType } from '../../redux-features/chat/createChannel/channelTypeSlice';

interface CreateChannelProps {
	trigger: boolean;
	setTrigger: (value: boolean) => void;
	children?: React.ReactNode;
	// socketRef: React.MutableRefObject<Socket | undefined>;
	getSelectedItem: (item: string) => void;
	newChannelCreated: MutableRefObject<boolean>;
}
  
function CreateChannel(props : CreateChannelProps) {
	
	const newName = useSelector((state: RootState) => state.persistedReducer.channelName);
	const channelUsersList : UserByLogin[] = useSelector((state : RootState) => state.persistedReducer.channelUser);
	const channelType = useSelector((state : RootState) => state.persistedReducer.channelType) as ChannelTypeState;
	const currentUser = useSelector((state : RootState) => state.persistedReducer.auth);
	const userFriends = useAppSelector(selectFriends) as UserByLogin[];
	const dispatch = useDispatch();
	const appDispatch = useAppDispatch();



	/*** ISSUE 110 ***/
	// HANDLE ERROR ON WHOLE createChannel
	const channelNameErrorState = useSelector((state: RootState) => state.persistedReducer.createChannelError.channelNameError);
	const channelUserListErrorState = useSelector((state: RootState) => state.persistedReducer.createChannelError.channelUserListError);
	const channelTypeErrorState = useSelector((state: RootState) => state.persistedReducer.createChannelError.channelTypeError);

	// when the search component is mounted the first time, get the list of users
	React.useEffect(() => {
		appDispatch(FetchUsersDb())
	}, [appDispatch]);

	/** ISSUE 113 ***/
	// SAFETY CHECK BETWEEN THE FRIENDS LIST WHICH IS UPDATED AUTOMATICALLY
	// AND THE USER LIST WHICH IS FIXED
	const isErrorBetweenFriendsUserList = (userList: UserByLogin[]): boolean => {
		// console.log('user firends ', userFriends)
		let result = false;
		userList.forEach((selectedFriend, index) => {
			// console.log("[createChannel - safetyCheckUserList]", "friend: ", selectedFriend.login, "index: ", index);
			const findFriends = userFriends.find((user) => user.login === selectedFriend.login);
			// console.log("[createChannel - safetyCheckUserList]", "findFriends", findFriends)
			if (findFriends === undefined) {
				result = true;
				return ;
			}
		})
		return result;
	}

	const channelCreation = async () => {
		// console.log('channelUsersList = ', channelUsersList);
		const createdBy : UserByLogin = {
			login : currentUser.nickname,
		};

		const updatedChannelUsersList = [...channelUsersList, createdBy];
		// console.log('channel User list  ', channelUsersList)

		try {
			/** ISSUE 113 ***/
			// SAFETY CHECK BETWEEN THE FRIENDS LIST WHICH IS UPDATED AUTOMATICALLY
			// AND THE USER LIST WHICH IS FIXED
			if (isErrorBetweenFriendsUserList(channelUsersList)) {
				throw new Error("Comparison issue between Friends and UserList");
			}
			await api
			.post ('http://localhost:4001/channel/creation', {
				name: newName,
				type: channelType.type,
				admins: [createdBy],
				protected_by_password: channelType.protected_by_password,
				key: channelType.key,
				members: updatedChannelUsersList,
				avatar: currentUser.avatar,
				chatHistory: [],
			})
			.catch((e) => {
				console.error(e)
			})

			// if channel is successfully added to the database, execute this :
			await appDispatch(fetchUserChannels());
			await appDispatch(fetchPublicChannels()); // to update the searchbar options
			props.getSelectedItem(newName);
			dispatch(resetChannelName());
			dispatch(resetChannelType());
			dispatch(resetChannelUser());

			props.newChannelCreated.current = true;

		} catch (error : any) {
			console.error('error while creating channel = ', error);
			dispatch(resetChannelName());
			dispatch(resetChannelType());
			dispatch(resetChannelUser());
		}
	}

	function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault(); // Prevents the default form submission behavior

		// Submit the form data
		channelCreation();
		props.setTrigger(false);
		appDispatch(setIsPopupOpen(false))
	}


	function handleCancelFormSubmit() {
		dispatch(resetChannelType());
		dispatch(resetChannelName());
		dispatch(resetChannelUser());
		props.setTrigger(false);
		appDispatch(setIsPopupOpen(false))
	}

	// HANDLE ERROR ON WHOLE createChannel COMPONENT IF:
	// - THE CHANNEL NAME IS INCORRECT
	// - THE USER LIST IS INCORRECT
	// - THE CHANNEL TYPE IS INCORRECT
	function checkCreateChannelState(): boolean {
		if (channelNameErrorState === false &&
		channelUserListErrorState === false &&
		channelTypeErrorState === false) {
				return false;
		}
		return true;
	}
	
	return (props.trigger) ? (
		<Box className='create-channel-popup'>
			<Stack spacing={6} className='create-channel-popup-inner' direction={'column'}>
				<Box className="close-button-container">
					<IconButton aria-label='close' size='large' onClick={handleCancelFormSubmit}>
						<DisabledByDefaultIcon fontSize='medium' sx={{ color: '#99E100' }} />
					</IconButton>
				</Box>
				<Box sx={{flexGrow: 1,  }}>
					<form onSubmit={handleFormSubmit}>
						<Stack spacing={2} direction={"column"} alignItems={'center'}>
							<Box className='create-channel-title'>
								<h1>CREATE YOUR CHANNEL</h1>
								<br></br>
							</Box>
							<CreateName />
							<CreateUsersList />
							<CreateType />
							<Box>
								<Button
									type='submit' // will trigger the form submission
									variant='contained'
									// size='large'
									sx={{ color: 'white', backgroundColor: '#99E100', fontWeight: '800', fontSize: '2em' }}
									disabled={checkCreateChannelState()}
								>CREATE CHANNEL
								</Button>
							</Box>
						</Stack>
					</form>
				</Box>
				{props.children}
			</Stack>
		</Box>
	) : null;
}

export default CreateChannel
