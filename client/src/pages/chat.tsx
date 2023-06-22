import { Provider, useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/NavBar';
import SideBar from './sideBar';
import { RootState, store } from '../app/store';
import { Box, Stack } from '@mui/material';
import Conversation from '../components/Conversation/Conversation';
import { Chat, Channel } from '../types/chat/chatTypes'
import './chat.css'
import { setSelectedChat } from '../redux-features/chat/selectedChatSlice';
import { useAppDispatch, useAppSelector } from "../utils/redux-hooks";
import { UserDetails } from "../types/users/userType";
import React from "react";
import { FetchAllUsers, selectSuggestions } from '../redux-features/friendship/friendshipSlice';
import { initChat } from '../redux-features/chat/chatsSlice';

function Chat () {
	const currentRoute = window.location.pathname;
	const dispatchSimple = useDispatch();

	const channels: Channel[] = useSelector((state:RootState) => state.persistedReducer.channels);
	// channels.map((channel) => console.log(channel));
	const dispatch = useAppDispatch();
	
	// when the display channels component is mounted the first time, get the list of users // TO DO : maybe change that
	React.useEffect(() => {dispatch(FetchAllUsers())}, []);
	
	// get list of users objects in a array
	const allUsers: UserDetails[] = useAppSelector((state) => selectSuggestions(state) as UserDetails[]);
	// allUsers.map((user) => console.log('users = ', user));

	dispatchSimple(initChat([...allUsers, ...channels]));

	// the list of the Chats
	const chats : Chat[] = useSelector((state: RootState) => state.persistedReducer.chats);

	// define what to do when a Chat is selected
	function handleSelectChat (chatID : string) {
		chats.find(chat => chat.login === chatID)
		dispatchSimple(setSelectedChat(chatID))		
	}
  
	return (
		<Provider store={store}>
			<Navbar currentRoute={ currentRoute }/>
			<Stack className='chat' direction={'row'} sx={{width: '100%'}}>
				<SideBar handleSelectItem={handleSelectChat} />
				<Box sx={{
					height: '95vh',
					width: '100vw',
					backgroundColor: '#fff',
				}}>
					<Conversation />
				</Box>
			</Stack>
		</Provider>
	)
}

export default Chat;