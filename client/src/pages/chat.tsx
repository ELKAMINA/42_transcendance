import { Provider, useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/NavBar';
import SideBar from './sideBar';
import { RootState, store } from '../app/store';
import { Box, Stack } from '@mui/material';
import Conversation from '../components/Conversation/Conversation';
import { DisplayedChat, Channel } from '../types/chat/chatTypes'
import './chat.css'
import { setSelectedChat } from '../redux-features/chat/selectedChatSlice';
import { useAppDispatch, useAppSelector } from "../utils/redux-hooks";
import React from "react";
import { initChat } from '../redux-features/chat/chatsSlice';
import { fetchUserChannels, selectUserChannels } from '../redux-features/chat/channelsSlice';

function Chat () {
	const currentRoute = window.location.pathname;
	const dispatchSimple = useDispatch();
	const dispatch = useAppDispatch();

	React.useEffect(() => {dispatch(fetchUserChannels())}, []);
	const channels = useAppSelector((state) => selectUserChannels(state)) as Channel[];
	console.log("user's channels : ", channels);

	React.useEffect(() => {
		dispatchSimple(initChat([...channels]));
	}, []);

	// the list of the Chats
	const chats : DisplayedChat[] = useSelector((state: RootState) => state.persistedReducer.chats);

	// define what to do when a Chat is selected
	function handleSelectChat (chatID : string) {
		// console.log('chatID = ', chatID);
		const selectedChat = chats.find(chat => chat.name === chatID)
		// console.log("selectedChat.name = ", selectedChat.name)
		dispatchSimple(setSelectedChat(selectedChat))
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