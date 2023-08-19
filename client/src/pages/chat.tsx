
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
import { fetchDisplayedChannel, fetchUserChannels, selectDisplayedChannel, selectIsMember, selectUserChannels, setIsMember } from '../redux-features/chat/channelsSlice';
import { Socket } from 'socket.io-client';
import socketIOClient from 'socket.io-client';
import { ChatMessage } from '../types/chat/messageType';


function Chat () {
	const currentRoute = window.location.pathname;
	const AppDispatch = useAppDispatch();

	const channels = useAppSelector((state) => selectUserChannels(state)) as Channel[];
	const displayedChannel : ChannelModel = useAppSelector(selectDisplayedChannel);
	const currentUser : string = useAppSelector(selectCurrentUser);
	const newChannelCreated = useRef<boolean>(false);
	const isNewMemberNotif = useAppSelector(selectIsMember)

	const channelDeleted = useRef<boolean>(false);
	const [selectedChannel, setSelectedChannel] = useState<string>(() => {
		if (channels.length === 0) {
			return 'WelcomeChannel';
		} else {
			return displayedChannel.name;
		}
	})
	
	const socketRef = useRef<Socket>();
	const roomId = selectedChannel;
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	useEffect(() => {
		AppDispatch(setIsMember(false));
	}, [])


	useEffect(() => {
		// console.log('[Chat] - roomId = ', roomId)

		if (selectedChannel === 'empty channel') // if roomId is 'WelcomeChannel'
			return ; // exit the function immediatly
		
		// create socket connection
		socketRef.current = socketIOClient("http://localhost:4002", {
			query: {roomId},
			withCredentials: true,
		})

		if (newChannelCreated.current || isNewMemberNotif) {
			socketRef.current?.emit('newChannelCreated');
			newChannelCreated.current = false;
			AppDispatch(setIsMember(false));
		}

		if (channelDeleted.current) {
			socketRef.current?.emit('channelDeleted');
			channelDeleted.current = false;
		}

		socketRef.current?.on('ServerToChat:' + roomId, (message : ChatMessage) => {
			const incomingMessage : ChatMessage = {
				...message,
				outgoing: message.sentBy === currentUser,
				incoming: message.sentBy !== currentUser,
			}
			// console.log('[From Messages : all Messages ]: ', messages)
			setMessages((messages) => [...messages, incomingMessage])
		})

		return () => {
			// console.log('[Unmounted Component Conversation] ', selectedChannel)
			if (socketRef.current?.connected)
				socketRef.current?.disconnect()
		}
	}, [roomId, isNewMemberNotif])

	socketRef.current?.off('newChannelNotif').on('newChannelNotif', () => {
		// console.log('[chat] - new channel has been created, and you are a member!');
		// console.log('[chat] - current user = ', currentUser);
		AppDispatch(fetchUserChannels());
	})

	socketRef.current?.off('channelDeletedNotif').on('channelDeletedNotif', () => {
		// console.log('[chat] - new channel has been created, and you are a member!');
		// console.log('[chat] - current user = ', currentUser);
		AppDispatch(fetchUserChannels());
	})

	/*** ISSUE 88 ***/
	socketRef.current?.off('channelKickNotif').on('channelKickNotif', () => {
		// console.log('[chat - on channelKickNotif]', 'A member has been kicked');
		// console.log('[chat - on channelKickNotif]', 'currentUser: ', currentUser);
		AppDispatch(fetchUserChannels());
	})
	
	useEffect(() => {
		if (selectedChannel !== '') {
			// console.log('[ From Chat.tsx - useEffect is trigerred ', selectedChannel)
			AppDispatch(fetchDisplayedChannel(selectedChannel));
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
				<SideBar handleSelectItem={handleSelectChannel} socketRef={socketRef} newChannelCreated={newChannelCreated} channelDeleted={channelDeleted}/>
				<div className='chat'>
					{isBanned === false && <Conversation socketRef={socketRef} messages={messages} setMessages={setMessages}/>}
					{isBanned === true && <Banned />}
				</div>
				</div>
			</div>
		</Provider>
	)
}

export default Chat;