import './chat.css'

import Navbar from '../components/NavBar';
import SideBar from './sideBar';
import Conversation from '../components/Conversation/Conversation';

import { Provider } from 'react-redux';
import { store } from '../app/store';
import { useAppDispatch, useAppSelector } from "../utils/redux-hooks";
import { useEffect, useState } from "react";
import { fetchDisplayedChannel, fetchUserChannels, selectUserChannels } from '../redux-features/chat/channelsSlice';
import { Channel } from '../types/chat/channelTypes';

function Chat () {
	const currentRoute = window.location.pathname;
	const [selectedChannel, setSelectedChannel] = useState<string>('')
	const channels = useAppSelector((state) => selectUserChannels(state)) as Channel[];
	
	const AppDispatch = useAppDispatch();
	useEffect(() => {
		let storedChannel = localStorage.getItem('selectedChannel');
		if (storedChannel && channels.length > 0) {
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

	// clean up the local storage when the window / tab is closed
	// useEffect(() => {
	// 	const clearLocalStorage = () => {
	// 		localStorage.clear();
	// 	};

	// 	window.addEventListener('beforeunload', clearLocalStorage);

	// 	return () => {
	// 		window.removeEventListener('beforeunload', clearLocalStorage);
	// 	};
	// }, []);

	return (
		<Provider store={store}>
			<div className='chat-container'>
				<Navbar currentRoute={currentRoute} />
				<div className='chat-wrapper'>
				<SideBar handleSelectItem={handleSelectChannel} />
				<div className='chat'>
					<Conversation />
				</div>
				</div>
			</div>
		</Provider>
	)
}

export default Chat;