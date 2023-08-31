
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
import { FetchAllFriends } from '../redux-features/friendship/friendshipSlice';

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
	const adminUpdate = useAppSelector(selectAdminUpdate);
	const channelDeleted = useRef<boolean>(false);
	const [selectedChannel, setSelectedChannel] = useState<string>(() => {
		if (channels.length === 0 || displayedChannel.name === 'empty channel' || displayedChannel.name === undefined) {
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
		AppDispatch(setIsBanned(false));
	}, [])

	useEffect(() => {
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
			setMessages((messages) => [...messages, incomingMessage])
		})
	
		socketRef.current?.on('channelDeletedNotif', (deletedChannelName : string) => {
			if (deletedChannelName === selectedChannel) {
				setSelectedChannel('WelcomeChannel');
			}
			AppDispatch(fetchPublicChannels());
			AppDispatch(fetchUserChannels());
		})

		socketRef.current?.on('ownerUpdate', () => {
			AppDispatch(fetchDisplayedChannel(roomId));
			AppDispatch(fetchUserChannels());
		})

		socketRef.current?.on('memberUpdate', () => {
			AppDispatch(fetchDisplayedChannel(roomId));
			AppDispatch(fetchUserChannels());
		})

		socketRef.current?.on('newChannelNotif', (userName : string) => {
			AppDispatch(fetchUserChannels());
			AppDispatch(fetchPublicChannels());
			if (currentUser != userName) {
				AppDispatch(fetchDisplayedChannel(roomId));
			}
		})

		socketRef.current?.on('bannedNotif', (userName : string) => {
			AppDispatch(fetchDisplayedChannel(roomId));
			AppDispatch(fetchUserChannels())
		})

		socketRef.current?.on('adminUpdate', () => {
			AppDispatch(fetchDisplayedChannel(roomId));
			AppDispatch(fetchUserChannels());
		})

		socketRef.current?.off("autoRefreshWhenUsernameChanging").on("autoRefreshWhenUsernameChanging", async () => {
			AppDispatch(fetchDisplayedChannel(roomId));
			AppDispatch(fetchUserChannels());
			AppDispatch(FetchAllFriends());
		})

		return () => {
			if (socketRef.current?.connected) {
				socketRef.current?.disconnect()
			}
		}
	}, [roomId])

	// REAL-TIME NEW CHANNEL MEMBER UPDATE -------------------------------------------------------------------------------------------------------------------------------
	useEffect(() => {
		// I emit the event only if the 'isMemberNotif' has been switched on by a user
		if (isNewMemberNotif) {
			socketRef.current?.emit('memberUpdate');
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
			AppDispatch(fetchDisplayedChannel(roomId))	
		}
	})

	// REAL-TIME 'CHANNEL MEMBER HAS BEEN KICKED OUT' UPDATE -------------------------------------------------------------------------------------------------------------------------------
	socketRef.current?.off('kickUpdate').on('kickUpdate', (userName: string, kickedFromRoomId : string) => {
		if (currentUser === userName) { // if I am the user being kicked out
			AppDispatch(fetchPublicChannels());
			AppDispatch(fetchUserChannels());
			if (selectedChannel === kickedFromRoomId) {
				AppDispatch(fetchDisplayedChannel("WelcomeChannel"));
			}
		} else { // if I am NOT the user being kicked out
			AppDispatch(fetchDisplayedChannel(roomId));
			AppDispatch(fetchUserChannels());
		}
	});
	
	useEffect(() => {
		if (selectedChannel !== '' && selectedChannel !== "empty channel") {
			AppDispatch(fetchDisplayedChannel(selectedChannel));
		}
	}, [selectedChannel]);

	function handleSelectChannel (channelName : string) {
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