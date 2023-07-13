	import { Box, Stack } from "@mui/material"
	import Header from "./Header"
	import Footer from "./Footer"
	import Message from "./Message"
	import { useEffect, useRef, useState } from "react"
	import { Socket, io } from "socket.io-client"
	import { ChatMessage } from "../../types/chat/messageType"
	import socketIOClient from 'socket.io-client';
	import { Channel } from "../../types/chat/channelTypes"
	import { useAppSelector } from "../../utils/redux-hooks"
	import { selectDisplayedChannel } from "../../redux-features/chat/channelsSlice"
	import { RootState } from "../../app/store"
	import { selectCurrentUser } from "../../redux-features/auth/authSlice"
	import { emptyChannel } from "../../data/emptyChannel"

	export const socket = io('http://localhost:4002', {
		withCredentials: true,
		transports: ['websocket'],
		upgrade: false,
		autoConnect: false,
		// reconnection: true,
	})

	function Conversation() {

		const selectedChannel: Channel = useAppSelector((state) => selectDisplayedChannel(state)) || emptyChannel;
		const roomId = selectedChannel.name;
		const [messages, setMessages] = useState<ChatMessage[]>([]);
		const socketRef = useRef<Socket>(); // by using useRef, the reference to the socket instance is preserved across re-renders of the component. 
		const messageContainerRef = useRef<HTMLDivElement>(null); // create a reference on the 'Box' element below
		const currentUser = useAppSelector((state : RootState) => selectCurrentUser(state));
		
		useEffect(() => {
			socketRef.current = socketIOClient("http://localhost:4002", {
				query: {roomId}
			})

			socketRef.current?.on('ServerToChat:' + roomId, (message : ChatMessage) => {
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
				socketRef.current?.disconnect()
			}
		}, [selectedChannel])

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
				<Header socketRef={socketRef}/>
				{/* Msg */}
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
			</Stack>
		)
	}

	export default Conversation