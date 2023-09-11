import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material'

import { useAppSelector } from '../../utils/redux-hooks';
import { ChatMessage } from '../../types/chat/messageType'
import areDifferentDays from '../../utils/areDifferentDays';
import { ChannelModel } from '../../types/chat/channelTypes';
import { selectDisplayedChannel } from '../../redux-features/chat/channelsSlice';
import { DocMsg, InfoMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from './MsgTypes'
import { selectActualUser } from '../../redux-features/friendship/friendshipSlice';
import { UserModel } from '../../types/users/userType';

function renderSwitchComponent(el : ChatMessage, index: number) {
	switch (el.subtype) {
		case 'img':
			return <MediaMsg key={index} el={el} />;
		case 'doc':
			return <DocMsg key={index} el={el} />;
		case 'link':
			return <LinkMsg key={index} el={el} />;
		case 'reply':
			return <ReplyMsg key={index} el={el} />;
		case 'infoMsg':
			return <InfoMsg key={index} el={el} />;
	  	default:
			return <TextMsg key={index} el={el} />;
	}
}

const Message = ({ messages, setMessages }: { messages : ChatMessage[], setMessages: (arg0: ChatMessage[]) => void }) => {
	const currentUser = useAppSelector(selectActualUser) as UserModel;
	const selectedChannel : ChannelModel = useAppSelector(selectDisplayedChannel);
	const [chat, setChat] = useState<ChatMessage[]>([]);
	// const AppDispatch = useAppDispatch();

	// React.useEffect(() => {
		// AppDispatch(FetchActualUser());
	// }, [])

	React.useEffect(()=> {
		return () => {
			setMessages([]); // reset messages state every time we change channel
		}
	// eslint-disable-next-line
	}, [selectedChannel])

	// Use a useEffect to update chat messages whenever selectedChannel and messages changes
    useEffect(() => {
		// console.log("[messages] = ", selectedChannel.name);
		
		// console.log("[messages] currentUser.blocked = ", currentUser.blocked);
		if (currentUser && selectedChannel && selectedChannel.chatHistory) {
            const newChat: ChatMessage[] = selectedChannel.chatHistory.concat(messages);
			const sortedChat : ChatMessage[] = newChat.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()); // sort messages from oldest to most recent
			const filteredBlockedUsersChat : ChatMessage[] = sortedChat.filter((el) => 
				selectedChannel.type === 'privateConv' || // if it is NOT a private conv, filter messages from blocked users
				!currentUser.blocked.some((blockedUser) => blockedUser.login === el.sentById)
			) 
			// console.log('filteredBlockedUsersChat = ', filteredBlockedUsersChat);
            setChat(filteredBlockedUsersChat);
        }
	// eslint-disable-next-line
    }, [selectedChannel, messages]);

	if (!selectedChannel || !selectedChannel.chatHistory) {
		return (
		<Box p={3}>
			<Typography variant="h2" gutterBottom sx={{ color: '#07457E' }}>
			{selectedChannel ? 'No messages yet!' : 'Selected channel not found!'}
			</Typography>
		</Box>
		);
	}

	// const chat: ChatMessage[] = selectedChannel.chatHistory.concat(messages);
	// chat.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()); // sort messages from oldest to most recent

	return (	
		<Box p={3}>
			<Stack spacing={3}>
				{chat
				.filter((el) => el.channelById === selectedChannel.name)
				// .filter((el) => !currentUser.blocked.some((blockedUser) => blockedUser.login === el.sentById)) // check if message has been sent by user blocked by currentUser
				.filter((el) => 
					selectedChannel.type === 'privateConv' || // if it is NOT a private conv, filter messages from blocked users
					!currentUser.blocked.some((blockedUser) => blockedUser.login === el.sentById)
				)
				.map((el, index) => {
					if (index === 0 || areDifferentDays(el.sentAt, chat[index - 1].sentAt)) {
						return (
							<React.Fragment key={`timeline-${index}`}>
								<Timeline key={`timeline-${index}`} date={el.sentAt} />
									{renderSwitchComponent(el, index)}
							</React.Fragment>
						);
					}
					return renderSwitchComponent(el, index);
				})}
			</Stack>
		</Box>
	)
}

export default Message
