import { Socket } from "socket.io-client"
import socketIOClient from 'socket.io-client';
import { Box, Stack, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

import Header from "./Header"
import Footer from "./Footer"
import Message from "./Message"
import { RootState } from "../../app/store"
import { emptyChannel } from "../../data/emptyChannel"
import { useAppDispatch, useAppSelector } from "../../utils/redux-hooks"
import { ChatMessage } from "../../types/chat/messageType"
import { ChannelModel } from "../../types/chat/channelTypes"
import { selectCurrentUser } from "../../redux-features/auth/authSlice"
import { selectDisplayedChannel, selectGameDialog, setGameDialog } from "../../redux-features/chat/channelsSlice"
import { useSocket } from "../../socket/SocketManager";

import GameSuggestion from '../Game/GameSuggestion'
import { EClientPlayType } from "../../enum/EClientGame";
import { TableBody } from "material-ui/Table";
import { useNavigate } from "react-router-dom";

export interface dialogInfo {
	sender: string,
	receiver: string,
	content: string,
	waiting: boolean, // false means it's the user who we suggested to
}

interface gameSugg {
	from: string,
	to: string,

}

function Conversation() {

	const selectedChannel: ChannelModel = useAppSelector((state) => selectDisplayedChannel(state)) || emptyChannel;
	const isWelcomeChannel = selectedChannel.name === 'WelcomeChannel' ? true : false;
	const roomId = selectedChannel.name;
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const messageContainerRef = useRef<HTMLDivElement>(null); // create a reference on the 'Box' element below
	const currentUser = useAppSelector((state : RootState) => selectCurrentUser(state));
	const socket = useSocket();
	
	const dispatch = useAppDispatch();
	const gameDialog = useAppSelector(selectGameDialog);
	const [open, setOpen] = useState<boolean>(false);
	const [gameDialogInfo, setGameDialogInfo] = useState<dialogInfo>({
		sender: '', receiver: '', content: '', waiting: false
	});
	const navigate = useNavigate();

	useEffect(() => {
		if (!socket) {
			return; // Exit if socket is not available
		}

		socket?.on('ServerToChat:' + roomId, (message : ChatMessage) => {
			// console.log('triggered!');
			const incomingMessage : ChatMessage = {
				...message,
				// outgoing: message.senderSocketId === socket?.id,
				// incoming: message.senderSocketId !== socket?.id,
				outgoing: message.sentBy === currentUser,
				incoming: message.sentBy !== currentUser,
			}
			setMessages((messages) => [...messages, incomingMessage])
		})

		return () => {
			socket?.disconnect();
			dispatch(setGameDialog(false)); // A VERIFIER AVEC AMINA
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

	const suggestGame = (gameSuggestionInfo: gameSugg) => {
		socket?.emit('suggestingGame', gameSuggestionInfo)
	}

	socket?.off('respondingGame').on('respondingGame', (gameSuggestionInfo: gameSugg)=> {
				// console.log(gameSuggestionInfo);
		if (gameSuggestionInfo.to !== currentUser){
			setGameDialogInfo({
				sender: gameSuggestionInfo.from,
				receiver: gameSuggestionInfo.to,
				content: `Waiting for ${gameSuggestionInfo.to} to accept the game`,
				waiting: true,
			})
		}
		else if (gameSuggestionInfo.to === currentUser){
			setGameDialogInfo({
				sender: gameSuggestionInfo.from,
				receiver: gameSuggestionInfo.to,
				content: `${gameSuggestionInfo.from} wanna play with you`,
				waiting: false,
			})
		}
		setOpen(true)
		dispatch(setGameDialog(true))
	})

	socket?.off('serverPrivateGame').on('serverPrivateGame', (gameAcceptance)=> {
		navigate(`/game?data`, {
            state: {
                data: {
                    type: EClientPlayType.ONETOONE,
                    sender: gameAcceptance.sender,
                    receiver: gameAcceptance.receiver,
                },
            },
        });
	})

	socket?.off('gameDenied').on('gameDenied', ()=> {
		setOpen(false)
		dispatch(setGameDialog(false))
	})

	socket?.off('gameCancelled').on('gameCancelled', ()=> {
		setOpen(false)
		dispatch(setGameDialog(false))
	})

	const handleClose = () => {
		setOpen(false)
	}

	const acceptGame = (gameAcceptance: any) => {
		socket?.emit('privateGame', gameAcceptance)
	}

	const denyGame = () => {
		socket?.emit('denyGame')
	}

	const cancelGame = () => {
		socket?.emit('cancelGame')
	}

	return (
		<Stack
			height={'100%'} 
			maxHeight={'100vh'}
			width={'auto'}
		>
			{isWelcomeChannel && gameDialog === false && (
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
			{!isWelcomeChannel && gameDialog === false && (
				<React.Fragment>
					<Header onSuggestGame={suggestGame} />
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
			{gameDialog === true && <GameSuggestion open={open} handleClose={handleClose} dialogContent={gameDialogInfo} onAcceptingGame={acceptGame} onDeny={denyGame} onCancel={cancelGame}/>}
		</Stack>
	)
}

export default Conversation