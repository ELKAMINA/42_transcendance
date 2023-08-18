import "./createChannel.css"

import React, { MutableRefObject } from "react";
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
import { fetchDisplayedChannel, fetchUserChannels } from "../../redux-features/chat/channelsSlice";
import { resetChannelUser } from "../../redux-features/chat/createChannel/channelUserSlice";
import { resetChannelName } from "../../redux-features/chat/createChannel/channelNameSlice";
import { FetchUsersDb, selectFriends } from "../../redux-features/friendship/friendshipSlice";
import { ChannelTypeState, resetChannelType } from '../../redux-features/chat/createChannel/channelTypeSlice';
import { Socket } from 'socket.io-client';

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

		try {
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

			// if channel is successfully added to the database, execute this
			await appDispatch(fetchUserChannels());
			// await appDispatch(fetchDisplayedChannel(newName));
			props.getSelectedItem(newName);
			dispatch(resetChannelName());
			dispatch(resetChannelType());
			dispatch(resetChannelUser());

			props.newChannelCreated.current = true;

		} catch (error : any) {
			console.log('error = ', error);
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
