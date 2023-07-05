import './chat.css'

import Navbar from '../components/NavBar';
import SideBar from './sideBar';
import Conversation from '../components/Conversation/Conversation';

import { Provider } from 'react-redux';
import { store } from '../app/store';
import { Box, Stack } from '@mui/material';
import { useAppDispatch } from "../utils/redux-hooks";
import { useEffect, useState } from "react";
import { fetchDisplayedChannel } from '../redux-features/chat/channelsSlice';

function Chat () {
	const currentRoute = window.location.pathname;
	const [selectedChannel, setSelectedChannel] = useState<string>('')
	
	const AppDispatch = useAppDispatch();
	useEffect(() => {
		const storedChannel = localStorage.getItem('selectedChannel');
		// TO DO --> add a check to verify weither or not channel still has not been deleted
		if (storedChannel) {
		  setSelectedChannel(storedChannel);
		  AppDispatch(fetchDisplayedChannel(storedChannel));
		}
	  }, []);
	
	useEffect(() => {
		if (selectedChannel !== '') {
			localStorage.setItem('selectedChannel', selectedChannel);
			AppDispatch(fetchDisplayedChannel(selectedChannel));
		}
	}, [selectedChannel]);

	function handleSelectChannel (channelName : string) {
		setSelectedChannel(channelName);
	}
  
	return (
		<Provider store={store}>
			<Navbar currentRoute={ currentRoute }/>
			<Stack className='chat' direction={'row'} sx={{width: '100%'}}>
				<SideBar handleSelectItem={handleSelectChannel} />
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