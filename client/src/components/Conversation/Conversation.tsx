import { Box, Stack } from "@mui/material"
import Header from "./Header"
import Footer from "./Footer"
import Message from "./Message"
import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"

function Conversation() {

	const [socket, setSocket] = useState<Socket>()

	const [messages, setMessages] = useState<string[]>([])


	// whenever we hit the "send" button...
	const send = (value: string) => {
		socket?.emit('message', value); // it emits an event called 'message'
	}

	// useEffect runs a function after the component has been rendered
	useEffect( () => {
		// after the component has been rendered for the first time, we want to create a new socket
		const newSocket = io("http://localhost:3000/chat")
		setSocket(newSocket)
	}, [setSocket]);

	// this function will be listening for events coming from our backend.
	// So, whenever we emit an event called 'message' from our Gateway, this function
	// will be run.
	const messageListener = (message: string) => {
		setMessages([...messages, message]);
	}

	useEffect(() => {
		socket?.on("message", messageListener)
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