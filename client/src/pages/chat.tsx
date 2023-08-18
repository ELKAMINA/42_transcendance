
import { Provider } from 'react-redux';
import { useEffect, useRef, useState } from "react";

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
import { Socket } from 'socket.io-client';
import socketIOClient from 'socket.io-client';


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
	
	const socketRef = useRef<Socket>();
	const roomId = selectedChannel;

	useEffect(() => {
		// console.log('[A larrivée sur Chat] ', selectedChannel)
		// console.log('[A larrivée sur Chat - roomId] ', roomId)

		if (selectedChannel === 'WelcomeChannel' || selectedChannel === 'empty channel') // if roomId is 'WelcomeChannel'
			return ; // exit the function immediatly
		socketRef.current = socketIOClient("http://localhost:4002", {
			query: {roomId},
			withCredentials: true,
		})

		return () => {
			// console.log('[Unmounted Component Conversation] ', selectedChannel)
			if (socketRef.current?.connected)
				socketRef.current?.disconnect()
		}
	}, [roomId])

	// useEffect(() => {
		// console.log('[A larrivée sur Chat : Channels] ', channels)
		// console.log('[A larrivée sur Chat : displayedChannels] ', displayedChannel)
		// console.log('[A larrivée sur Chat : CurrentUser] ', currentUser)
		// console.log('[A larrivée sur Chat : selectedChannel] ', selectedChannel)
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
					{isBanned === false && <Conversation socketRef={socketRef} />}
					{isBanned === true && <Banned />}
				</div>
				</div>
			</div>
		</Provider>
	)
}

export default Chat;