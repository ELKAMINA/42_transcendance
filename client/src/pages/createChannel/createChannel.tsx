import "./createChannel.css"

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import React, { useEffect } from "react";
import CreateName from "./createName";
import CreateUsersList from "./createUsersList";
import CreateType from "./createChannelType";
import { ChannelTypeState, resetChannelType } from '../../redux-features/chat/createChannel/channelTypeSlice';
import { Box, Button, Stack } from "@mui/material";
import { IconButton } from "@mui/material";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import api from '../../utils/Axios-config/Axios' 
import { resetChannelName } from "../../redux-features/chat/createChannel/channelNameSlice";
import { resetChannelUser } from "../../redux-features/chat/createChannel/channelUserSlice";
import bugsBunny from '../../assets/profile_pictures/bugs-carrot.jpg'
import { useAppDispatch, useAppSelector } from "../../utils/redux-hooks";
import { fetchUserChannels } from "../../redux-features/chat/channelsSlice";
import { UserByLogin, UserModel } from "../../types/users/userType";
import { FetchUsersDb, selectFriends } from "../../redux-features/friendship/friendshipSlice";

interface CreateChannelProps {
	trigger: boolean;
	setTrigger: (value: boolean) => void;
	children?: React.ReactNode;
}
  
function CreateChannel(props : CreateChannelProps) {
	
	const newName = useSelector((state: RootState) => state.persistedReducer.channelName);
	const channelUsersList : UserByLogin[] = useSelector((state : RootState) => state.persistedReducer.channelUser);
	const channelType = useSelector((state : RootState) => state.persistedReducer.channelType) as ChannelTypeState;
	const currentUser = useSelector((state : RootState) => state.persistedReducer.auth);
	const userFriends = useAppSelector(selectFriends) as UserByLogin[];
	const simplifiedFriends: UserByLogin[] = userFriends.map(({ login }) => ({ login })); // converting UserModel to UserByLogin to keep only login property
	const dispatch = useDispatch();
	const appDispatch = useAppDispatch();

	// when the search component is mounted the first time, get the list of users
	React.useEffect(() => {appDispatch(FetchUsersDb())}, [appDispatch]);

	const channelCreation = async () => {
		// console.log('channelUsersList = ', channelUsersList);
		const createdBy : UserByLogin = {
			login : currentUser.nickname,
		};

		const updatedChannelUsersList = [...channelUsersList, createdBy];

		await api
		.post ('http://localhost:4001/channel/creation', {
			name: newName,
			channelId: Date.now(),
			type: channelType.type,
			createdBy: createdBy,
			admins: [createdBy],
			protected_by_password: channelType.protected_by_password,
			key: channelType.key,
			members: updatedChannelUsersList,
			avatar: currentUser.avatar,
			chatHistory: [],
		})
		.then ((response) => {
			// console.log('this channel has been added to the database = ', response);
			appDispatch(fetchUserChannels());
			dispatch(resetChannelName());
			dispatch(resetChannelType());
			dispatch(resetChannelUser());
		})
		.catch ((error) => {
			console.log('error = ', error);
			dispatch(resetChannelName());
			dispatch(resetChannelType());
			dispatch(resetChannelUser());
		})
	}

	function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault(); // Prevents the default form submission behavior

		// Submit the form data
		channelCreation();
		props.setTrigger(false);
	}


	function handleCancelFormSubmit() {
		dispatch(resetChannelType());
		dispatch(resetChannelName());
		dispatch(resetChannelUser());
		props.setTrigger(false);
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
							<CreateUsersList userList={simplifiedFriends}/>
							<CreateType />
							<Box>
								<Button
									type='submit' // will trigger the form submission
									variant='contained'
									// size='large'
									sx={{ color: 'white', backgroundColor: '#99E100', fontWeight: '800', fontSize: '2em' }}
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
