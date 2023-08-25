
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
import { fetchDisplayedChannel, fetchPublicChannels, fetchUserChannels, selectAdminUpdate, selectDisplayedChannel, selectIsBanned, selectIsMember, selectOwnerUpdate, selectUserChannels, setAdminUpdate, setKickedUpdate, setIsBanned, setIsMember, setOwnerUpdate, selectKickedUpdate } from '../redux-features/chat/channelsSlice';
import { Socket } from 'socket.io-client';
import socketIOClient from 'socket.io-client';
import { ChatMessage } from '../types/chat/messageType';
import { emptyChannel } from '../data/emptyChannel';


function Chat () {
	const currentRoute = window.location.pathname;
	const AppDispatch = useAppDispatch();

	const channels = useAppSelector((state) => selectUserChannels(state)) as Channel[];
	const displayedChannel : ChannelModel = useAppSelector(selectDisplayedChannel);
	const userChannels : ChannelModel[] = useAppSelector(selectUserChannels);
	const currentUser : string = useAppSelector(selectCurrentUser);
	const newChannelCreated = useRef<boolean>(false);
	const isNewMemberNotif = useAppSelector(selectIsMember)
	const justBeenBannedNotif = useAppSelector(selectIsBanned);
	const ownerUpdate = useAppSelector(selectOwnerUpdate);
	// const kickedUpdate = useAppSelector(selectKickedUpdate);
	const adminUpdate = useAppSelector(selectAdminUpdate);
	const channelDeleted = useRef<boolean>(false);
	const [selectedChannel, setSelectedChannel] = useState<string>(() => {
		if (channels.length === 0 || displayedChannel.name === 'empty channel' || displayedChannel.name === undefined) {
			return 'WelcomeChannel';
		} else {
			// console.log('here ', displayedChannel.name)
			return displayedChannel.name;
		}
	})
	
	// console.log('Selected Channel ', selectedChannel)

	const socketRef = useRef<Socket>();
	const roomId = selectedChannel;
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	useEffect(() => {
		AppDispatch(setIsMember(false));
		AppDispatch(setIsBanned(false));
	}, [])

	useEffect(() => {
		// console.log('[Chat] - roomId = ', roomId)

		if (selectedChannel === 'empty channel') // if roomId is 'empty channel'
			return ; // exit the function immediatly
		
		// every time we change room, we create a new socket associated with a specific room
		socketRef.current = socketIOClient("http://localhost:4002", {
			query: {roomId},
			withCredentials: true,
		})

		if (newChannelCreated.current) {
			socketRef.current?.emit('newChannelCreated', currentUser);
			newChannelCreated.current = false;
			// AppDispatch(setIsMember(false));
		}

		if (channelDeleted.current) {
			socketRef.current?.emit('channelDeleted', displayedChannel.name);
			channelDeleted.current = false;
		}

		// // FOR DEBUG -----------------------------------------------------------------------------
		// const eventName = 'newChannelNotif';
		// // Get the list of listeners for the event
		// const listeners = socketRef.current?.listeners(eventName);
		// // Print the list of listeners
		// console.log(`Listeners for ${eventName}:`, listeners);
		// // END -----------------------------------------------------------------------------------

		// every time we change room, we create a new event listener 
		// for a specific event associated with the specific socket created for the room
		// in other words : each room has its own socket and its own event listeners
		socketRef.current?.on('ServerToChat:' + roomId, (message : ChatMessage) => {
			const incomingMessage : ChatMessage = {
				...message,
				outgoing: message.sentBy === currentUser,
				incoming: message.sentBy !== currentUser,
			}
			// console.log('[From Messages : all Messages ]: ', messages)
			setMessages((messages) => [...messages, incomingMessage])
		})
	
		socketRef.current?.on('channelDeletedNotif', (deletedChannelName : string) => {
			// console.log('[chat] - new channel has been deleted, and you were a member!');
			// console.log('[chat] - current user = ', currentUser);
			// if the channel deleted is the one the current user is displaying
			// console.log('[chat] - displayed channel = ', displayedChannel.name);
			// console.log('[chat] - deletedChannelName = ', deletedChannelName);
			// console.log('[chat - selectedChannel = ', selectedChannel);
			if (deletedChannelName === selectedChannel) {
				// AppDispatch(fetchDisplayedChannel('WelcomeChannel'));
				setSelectedChannel('WelcomeChannel');
			}
			AppDispatch(fetchUserChannels());
		})

		socketRef.current?.on('ownerUpdate', () => {
			// console.log('[chat] - owner update!');
			// console.log('[chat] - current user = ', currentUser);
			// console.log("[chat] roomId = ", roomId);
			AppDispatch(fetchDisplayedChannel(roomId));
			AppDispatch(fetchUserChannels());
		})

		socketRef.current?.on('newChannelNotif', (userName : string) => {
			// console.log('[chat] - member notif !');
			// console.log('[chat] - current user = ', currentUser);
			AppDispatch(fetchUserChannels());
			if (currentUser != userName) 
				AppDispatch(fetchDisplayedChannel(roomId));
		})

		socketRef.current?.on('bannedNotif', (userName : string) => {
			// console.log('[chat] - BANNED!');
			// console.log('[chat] - current user = ', currentUser);
			// console.log("[chat] roomId = ", roomId);
			if (currentUser != userName)
				AppDispatch(fetchDisplayedChannel(roomId));
			// AppDispatch(fetchPublicChannels())
			AppDispatch(fetchUserChannels())
		})

		socketRef.current?.on('adminUpdate', () => {
			// console.log('[chat] - owner update!');
			// console.log('[chat] - current user = ', currentUser);
			// console.log("[chat] roomId = ", roomId);
			AppDispatch(fetchDisplayedChannel(roomId));
			AppDispatch(fetchUserChannels());
		})

		return () => {
			// console.log('[Unmounted Component Conversation] ', selectedChannel)
			if (socketRef.current?.connected) {
				// console.log('[Unmounted Component Conversation] socketRef.current?.id = ', socketRef.current?.id)
				socketRef.current?.disconnect()
			}
		}
	}, [roomId])

	// useEffect(() => {
	// 	console.log('[chat - from USE EFFECT] - displayed channel = ', displayedChannel.name);
	// }, [displayedChannel])

	// useEffect(() => {
	// 	console.log('[chat - from USE EFFECT] - selectedChannel = ', selectedChannel);
	// }, [selectedChannel])


	// REAL-TIME NEW CHANNEL MEMBER UPDATE -------------------------------------------------------------------------------------------------------------------------------
	useEffect(() => {
		// console.log( "[isNewMemberNotif] roomId = ", roomId )
		// console.log( "[isNewMemberNotif] socketRef.current.id = ", socketRef.current?.id )
		// console.log( "[isNewMemberNotif] newChannelCreated = ", newChannelCreated )

		// I emit the event only if the 'isMemberNotif' has been switched on by a user
		if (isNewMemberNotif) {
			socketRef.current?.emit('newChannelCreated', currentUser);
			newChannelCreated.current = false;
			AppDispatch(setIsMember(false));
		}

	}, [isNewMemberNotif])

	// REAL-TIME BANNED MEMBER UPDATE -------------------------------------------------------------------------------------------------------------------------------
	useEffect(() => {
		if (justBeenBannedNotif) {
			socketRef.current?.emit('bannedNotif', currentUser);
			AppDispatch(setIsBanned(false));
		}
	}, [justBeenBannedNotif])

	// REAL-TIME CHANNEL OWNER UPDATE -------------------------------------------------------------------------------------------------------------------------------
	useEffect(() => {
		// we emit the event if the 'owner update' switch has been turn on
		if (ownerUpdate) {
			socketRef.current?.emit('ownerUpdate');
			AppDispatch(setOwnerUpdate(false));
		}
	}, [ownerUpdate])

	// REAL-TIME CHANNEL ADMIN UPDATE -------------------------------------------------------------------------------------------------------------------------------
	useEffect(() => {
		// we emit the event if the 'admin update' switch has been turn on
		if (adminUpdate) {
			socketRef.current?.emit('adminUpdate');
			AppDispatch(setAdminUpdate(false));
		}

	}, [adminUpdate])

	// REAL-TIME 'CHANNEL MEMBER HAS LEFT' UPDATE -------------------------------------------------------------------------------------------------------------------------------
	socketRef.current?.off('leavingChannelNotif').on('leavingChannelNotif', (userName : string) => {
		if (currentUser !== userName) {
			AppDispatch(fetchUserChannels());
			// console.log("received event member left the room = ", roomId);
			AppDispatch(fetchDisplayedChannel(roomId))	
		}
	})

	// REAL-TIME 'CHANNEL MEMBER HAS BEEN KICKED OUT' UPDATE -------------------------------------------------------------------------------------------------------------------------------
	socketRef.current?.on('kickUpdate', (userName: string, kickedFromRoomId : string) => {
		if (currentUser === userName) { // if I am the user being kicked out
			// console.log("selectedChannel.name = ", selectedChannel.name);console.log
			// console.log("kickedFromRoomId = ", kickedFromRoomId);
			if (selectedChannel === kickedFromRoomId) {
				// console.log('I am being kicked out of the channel I am displaying')
				AppDispatch(fetchDisplayedChannel("WelcomeChannel"));
				AppDispatch(fetchUserChannels());
			}
		} else {
			// console.log('Someone was kicked out of the channel I am displaying')
			// AppDispatch(fetchUserChannels());
			// console.log("roomId = ", roomId);
			AppDispatch(fetchDisplayedChannel(roomId));
		}
	});
	
	useEffect(() => {
		if (selectedChannel !== '' && selectedChannel !== "empty channel") {
			// console.log('[ From Chat.tsx - useEffect is trigerred ', selectedChannel)
			AppDispatch(fetchDisplayedChannel(selectedChannel));
		}
	}, [selectedChannel]);

	function handleSelectChannel (channelName : string) {
		// console.log('[From Chat.tsx : selectedItem ]: ', channelName)
		setSelectedChannel(channelName);
	}

	let isBanned = false;
	if (displayedChannel && displayedChannel.name !== 'WelcomeChannel' && displayedChannel.banned) {
		isBanned = displayedChannel.banned.some(banned => currentUser === banned.login) // if user is part of the banned user list
	}
	useEffect(() => {
		if (displayedChannel && displayedChannel.name !== 'WelcomeChannel' && displayedChannel.banned)
			isBanned = displayedChannel.banned.some(banned => currentUser === banned.login) // if user is part of the banned user list
	}, [userChannels, displayedChannel]) // when the channels for which the user is a member are modified, re-check if he is now banned from any of them

	return (
		<Provider store={store}>
			<div className='chat-container'>
				<Navbar currentRoute={currentRoute} />
				<div className='chat-wrapper'>
				<SideBar handleSelectItem={handleSelectChannel} newChannelCreated={newChannelCreated} channelDeleted={channelDeleted}/>
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