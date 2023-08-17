
import { Provider } from 'react-redux';
import { useEffect, useState } from "react";

import './chat.css'
import SideBar from './sideBar';
import { store } from '../app/store';
import Navbar from '../components/NavBar';
import Banned from '../components/Conversation/Banned';
import Conversation from '../components/Conversation/Conversation';
import { Channel, ChannelModel } from '../types/chat/channelTypes';
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { useAppDispatch, useAppSelector } from "../utils/redux-hooks";
import { fetchDisplayedChannel, fetchUserChannels, selectDisplayedChannel, selectUserChannels } from '../redux-features/chat/channelsSlice';

function Chat () {
	const currentRoute = window.location.pathname;
	const AppDispatch = useAppDispatch();

	const channels = useAppSelector((state) => selectUserChannels(state)) as Channel[];
	const displayedChannel : ChannelModel = useAppSelector(selectDisplayedChannel);
	const currentUser : string = useAppSelector(selectCurrentUser);

	const [selectedChannel, setSelectedChannel] = useState<string>(() => {
		if (channels.length === 0) {
			return 'WelcomeChannel';
		} else {
			return displayedChannel.name;
		}
	})

	// useEffect(() => {
	// 	console.log('[A larrivée sur Chat : Channels] ', channels)
	// 	console.log('[A larrivée sur Chat : displayedChannels] ', displayedChannel)
	// 	console.log('[A larrivée sur Chat : CurrentUser] ', currentUser)
	// 	console.log('[A larrivée sur Chat : selectedChannels] ', selectedChannel)
	// }, []);
	
	useEffect(() => {
		if (selectedChannel !== '') {
			// console.log('[ From Chat.tsx - useEffect is trigerred ', selectedChannel)
			AppDispatch(fetchDisplayedChannel(selectedChannel));
			AppDispatch(fetchUserChannels());
		}
	}, [selectedChannel]);

	function handleSelectChannel (channelName : string) {
		// console.log('[From Chat.tsx : selectedItem ]: ', channelName)
		setSelectedChannel(channelName);
	}

	const isBanned = displayedChannel.banned.some(banned => currentUser === banned.login) // if user is part of the banned user list 

	return (
		<Provider store={store}>
			<div className='chat-container'>
				<Navbar currentRoute={currentRoute} />
				<div className='chat-wrapper'>
				<SideBar handleSelectItem={handleSelectChannel} />
				<div className='chat'>
					{isBanned === false && <Conversation />}
					{isBanned === true && <Banned />}
				</div>
				</div>
			</div>
		</Provider>
	)
}

export default Chat;