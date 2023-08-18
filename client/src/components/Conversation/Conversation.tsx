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

import GameSuggestion from '../Game/GameSuggestion'
import { EClientPlayType } from "../../enum/EClientGame";
import { TableBody } from "material-ui/Table";
import { useNavigate } from "react-router-dom";

// import { wait } from "../../utils/global/global";

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
	
	const dispatch = useAppDispatch();
	const gameDialog = useAppSelector(selectGameDialog);
	const [open, setOpen] = useState<boolean>(false);
	const [gameDialogInfo, setGameDialogInfo] = useState<dialogInfo>({
		sender: '', receiver: '', content: '', waiting: false
	});
	const navigate = useNavigate();
	
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

		return () => {
			// socketRef.current?.disconnect();
			dispatch(setGameDialog(false)); // A VERIFIER AVEC AMINA
		}
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

	const suggestGame = (gameSuggestionInfo: gameSugg) => {
		socketRef.current?.emit('suggestingGame', gameSuggestionInfo)
	}

	// A REVOIR AVEC AMINA
	socketRef.current?.off('respondingGame').on('respondingGame', (gameSuggestionInfo: gameSugg)=> {
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

	socketRef.current?.off('serverPrivateGame').on('serverPrivateGame', (gameAcceptance)=> {
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

	socketRef.current?.off('gameDenied').on('gameDenied', ()=> {
		setOpen(false)
		dispatch(setGameDialog(false))
	})

	socketRef.current?.off('gameCancelled').on('gameCancelled', ()=> {
		setOpen(false)
		dispatch(setGameDialog(false))
	})

	const handleClose = () => {
		setOpen(false)
	}

	const acceptGame = (gameAcceptance: any) => {
		socketRef.current?.emit('privateGame', gameAcceptance)
	}

	const denyGame = () => {
		socketRef.current?.emit('denyGame')
	}

	const cancelGame = () => {
		socketRef.current?.emit('cancelGame')
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
					<Header socketRef={socketRef} onSuggestGame={suggestGame} />
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
					<Footer send = {send} socketRef={socketRef}/>
				</React.Fragment>
			)}
			{gameDialog === true && <GameSuggestion open={open} handleClose={handleClose} dialogContent={gameDialogInfo} onAcceptingGame={acceptGame} onDeny={denyGame} onCancel={cancelGame}/>}
		</Stack>
	)
}

export default Conversation