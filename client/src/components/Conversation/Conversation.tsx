import { Box, Stack } from "@mui/material"
import Header from "./Header"
import Footer from "./Footer"
import Message from "./Message"
import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"
import { ChatMessage } from "../../types/chat/messageType"
import { useSelector } from "react-redux"

function Conversation() {

	const [socket, setSocket] = useState<Socket>()

	const [messages, setMessages] = useState<ChatMessage[]>([])


	// whenever we hit the "send" button...
	const send = (value: ChatMessage) => {
		// console.log('message to be sent = ', value);
		socket?.emit('message', value); // it emits an event called 'message'
	}

	// after the component has been rendered for the first time, we want to create a new socket
	useEffect( () => {
		const newSocket = io("http://localhost:4002")
		setSocket(newSocket)
	}, [setSocket]);

	// get the message received from the backend and put them all in the 'message' state.
	const messageListener = (message: ChatMessage) => {
		setMessages([...messages, message]);
	}

	useEffect(() => {
		// Setting an event listener of the 'socket' object.
		// It listens for the event called 'message'.
		// When a event called 'message' is emitted from
		// the backend, the 'messageListener' function
		// is called.
		socket?.on("message", messageListener)
		// clean up function
		return () => {
			socket?.off("message", messageListener)
		}
	}, [messageListener])

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