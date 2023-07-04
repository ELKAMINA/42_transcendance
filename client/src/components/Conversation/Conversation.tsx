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


	function Conversation() {

		const selectedChannel : Channel = useAppSelector((state: RootState) => selectDisplayedChannel(state));
		const roomId = selectedChannel.name;
		const [messages, setMessages] = useState<ChatMessage[]>([]);
		const socketRef = useRef<Socket>();

		useEffect(() => {
			
			socketRef.current = socketIOClient("http://localhost:4002", {
				query: {roomId}
			})

			socketRef.current.on('ServerToChat:' + roomId, (message : ChatMessage) => {
				const incomingMessage : ChatMessage = {
					...message,
					outgoing: message.senderSocketId !== socketRef.current?.id,
					incoming: message.senderSocketId === socketRef.current?.id,
				}
				// console.log('incoming message = ', incomingMessage)
				setMessages((messages) => [...messages, incomingMessage])
			})

			return () => {
				socketRef.current?.disconnect()
			}

		}, [selectedChannel])

		const send = (value : ChatMessage) => {
			if (socketRef.current)
				value.senderSocketId = socketRef.current.id
			socketRef.current?.emit('ChatToServer', value)
		}

		return (
			<Stack
				height={'100%'} 
				maxHeight={'100vh'}
				width={'auto'}
			>
				<Header />
				{/* Msg */}
				<Box
					width={'100%'}
					sx={{
						flexGrow:1, // ensures that the message section expands and takes up all the available vertical space between the chat header and footer.
						height:'100%',
						overflowY:'scroll',	
					}}
				>
					<Message messages = {messages} />
				</Box>
				<Footer send = {send} />
			</Stack>
		)
	}

	export default Conversation