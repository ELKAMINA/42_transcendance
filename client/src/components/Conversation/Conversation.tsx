import { Socket } from "socket.io-client"
import socketIOClient from 'socket.io-client';
import { Box, Stack, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

import Header from "./Header"
import Footer from "./Footer"
import Message from "./Message"
import { RootState } from "../../app/store"
import { emptyChannel } from "../../data/emptyChannel"
import { useAppSelector } from "../../utils/redux-hooks"
import { ChatMessage } from "../../types/chat/messageType"
import { ChannelModel } from "../../types/chat/channelTypes"
import { selectCurrentUser } from "../../redux-features/auth/authSlice"
import { selectDisplayedChannel } from "../../redux-features/chat/channelsSlice"
import { useSocket } from "../../socket/SocketManager";

function Conversation() {

	const selectedChannel: ChannelModel = useAppSelector((state) => selectDisplayedChannel(state)) || emptyChannel;
	const isWelcomeChannel = selectedChannel.name === 'WelcomeChannel' ? true : false;
	const roomId = selectedChannel.name;
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const messageContainerRef = useRef<HTMLDivElement>(null); // create a reference on the 'Box' element below
	const currentUser = useAppSelector((state : RootState) => selectCurrentUser(state));
	const socket = useSocket();

	useEffect(() => {
		if (!socket) {
			return; // Exit if socket is not available
		}

		socket?.on('ServerToChat:' + roomId, (message : ChatMessage) => {
			// console.log('triggered!');
			const incomingMessage : ChatMessage = {
				...message,
				// outgoing: message.senderSocketId === socketRef.current?.id,
				// incoming: message.senderSocketId !== socketRef.current?.id,
				outgoing: message.sentBy === currentUser,
				incoming: message.sentBy !== currentUser,
			}
			setMessages((messages) => [...messages, incomingMessage])
		})

		return () => {
			socket?.disconnect()
		}
	}, [selectedChannel, socket])

	const send = (value : ChatMessage) => {
		if (socket) {
			value.senderSocketId = socket.id
		}
		socket?.emit('ChatToServer', value)
	}

	// scroll the Box element to the bottom by setting the scrollTop property to the scrollHeight hehe
	const scrollMessageContainerToBottom = () => {
		if (messageContainerRef.current) {
			messageContainerRef.current.scrollTop =
			messageContainerRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollMessageContainerToBottom();
	}, [messages]); // call the function when messages change

	useEffect(() => {
		scrollMessageContainerToBottom(); // scroll to bottom when the component is rendered
	}, []);

	return (
		<Stack
			height={'100%'} 
			maxHeight={'100vh'}
			width={'auto'}
		>
			{isWelcomeChannel && (
				<Stack direction={'column'} justifyContent={'center'}>
					<Box
						sx={{
							alignItems: 'center',
							justifyContent: 'center',
					}}>
						<Typography 
							align="center" 
							variant='h1' 
							sx={{color: 'grey', fontStyle: 'italic'}}>
								No channel selected yet...
						</Typography>
					</Box>
				</Stack>
			)}
			{!isWelcomeChannel && (
				<React.Fragment>
					<Header />
					<Box
						width={'100%'}
						sx={{
							flexGrow:1, // ensures that the message section expands and takes up all the available vertical space between the chat header and footer.
							height:'100%',
							overflowY:'scroll',	
						}}
						ref={messageContainerRef}
					>
						<Message messages = {messages} />
					</Box>
					<Footer send = {send} />
				</React.Fragment>
			)}
		</Stack>
	)
}

export default Conversation