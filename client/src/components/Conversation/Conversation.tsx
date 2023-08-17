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
import { wait } from "../../utils/global/global";

type ConvProps = {
	socketRef: React.MutableRefObject<Socket | undefined>;
};

function Conversation({socketRef} : ConvProps) {

	const selectedChannel: ChannelModel = useAppSelector((state) => selectDisplayedChannel(state)) || emptyChannel;
	const isWelcomeChannel = selectedChannel.name === 'WelcomeChannel' ? true : false;
	const roomId = selectedChannel.name;
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const messageContainerRef = useRef<HTMLDivElement>(null); // create a reference on the 'Box' element below
	const currentUser = useAppSelector((state : RootState) => selectCurrentUser(state));
	
	// useEffect(() => {
		// console.log('[A larrivée sur Conversation : selectedChannels] ', selectedChannel)
		// console.log('[A larrivée sur Conversation : Welcome Channel] ', isWelcomeChannel)
		// console.log('[A larrivée sur Conversation : CurrentUser] ', currentUser)
	// }, []);
	
	// async function waitforme() {
		// await wait(2000);
		// console.log('error 2');
	// }

	useEffect(() => {
		socketRef.current?.on('ServerToChat:' + roomId, (message : ChatMessage) => {
			const incomingMessage : ChatMessage = {
				...message,
				outgoing: message.sentBy === currentUser,
				incoming: message.sentBy !== currentUser,
			}
			// console.log('[From Messages : all Messages ]: ', messages)
			setMessages((messages) => [...messages, incomingMessage])
		})

	}, [roomId])


// --- OTHER SOLUTION ----
	// useEffect(() => {
	// 	const messageListener = (message: ChatMessage) => {
	// 		const incomingMessage: ChatMessage = {
	// 			...message,
	// 			outgoing: message.sentBy === currentUser,
	// 			incoming: message.sentBy !== currentUser,
	// 		};
	// 		setMessages((prevMessages) => [...prevMessages, incomingMessage]);
	// 	};
	
	// 	socketRef.current?.on('ServerToChat:' + roomId, messageListener);
	
	// 	return () => {
	// 		socketRef.current?.off('ServerToChat:' + roomId, messageListener);
	// 	};
	// }, [selectedChannel, currentUser]);

// --- END OF OTHER SOLUTION ----

	const send = (value : ChatMessage) => {
		if (socketRef.current) {
			value.senderSocketId = socketRef.current.id
		}
		socketRef.current?.emit('ChatToServer', value)
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
		// console.log('[IN THE USEEFFECT -- From Messages: all Messages ]: ', messages)
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
					<Header socketRef={socketRef}/>
					<Box
						width={'100%'}
						sx={{
							flexGrow:1, // ensures that the message section expands and takes up all the available vertical space between the chat header and footer.
							height:'100%',
							overflowY:'scroll',	
						}}
						ref={messageContainerRef}
					>
						<Message messages = {messages} setMessages={setMessages}/>
					</Box>
					<Footer send = {send} />
				</React.Fragment>
			)}
		</Stack>
	)
}

export default Conversation