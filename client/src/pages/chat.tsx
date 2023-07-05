import './chat.css'

import Navbar from '../components/NavBar';
import SideBar from './sideBar';
import Conversation from '../components/Conversation/Conversation';

import { Provider } from 'react-redux';
import { store } from '../app/store';
import { Box, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from "../utils/redux-hooks";
import { useEffect, useState } from "react";
import { fetchDisplayedChannel, fetchUserChannels, selectUserChannels } from '../redux-features/chat/channelsSlice';
import { Channel } from 'diagnostics_channel';

function Chat () {
	const currentRoute = window.location.pathname;
	const [selectedChannel, setSelectedChannel] = useState<string>('')
	const channels = useAppSelector((state) => selectUserChannels(state)) as Channel[];
	
	const AppDispatch = useAppDispatch();
	useEffect(() => {
		let storedChannel = localStorage.getItem('selectedChannel');
		if (storedChannel) {
			if (!channels.some(channel => channel.name === storedChannel))
				typeof channels[0].name === 'string' && (storedChannel = channels[0].name);
			else 
				setSelectedChannel(storedChannel);
			AppDispatch(fetchDisplayedChannel(storedChannel));
			AppDispatch(fetchUserChannels());
		}
	  }, []);
	
	useEffect(() => {
		if (selectedChannel !== '') {
			localStorage.setItem('selectedChannel', selectedChannel);
			AppDispatch(fetchDisplayedChannel(selectedChannel));
			AppDispatch(fetchUserChannels());
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