import { Box, Stack, Typography } from '@mui/material'
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from './MsgTypes'
import { ChatMessage } from '../../types/chat/messageType'
import { useAppDispatch, useAppSelector } from '../../utils/redux-hooks';
import { selectDisplayedChannel } from '../../redux-features/chat/channelsSlice';
import { Channel } from '../../types/chat/channelTypes';
import areDifferentDays from '../../utils/areDifferentDays';
import React, { useEffect } from 'react';

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
	  default:
		return <TextMsg key={index} el={el} />;
	}
}

const Message = ({ messages }: { messages : ChatMessage[] }) => {

	const selectedChannel : Channel = useAppSelector((state) => selectDisplayedChannel(state));
	// console.log('selected channel in messages = ', selectedChannel);
	// console.log('chat history = ', selectedChannel.chatHistory);

	if (!selectedChannel) {
		return null; // If selectedChannel is null, don't render anything
	}

	if (!selectedChannel.chatHistory) {
		return (
		<Box p={3} >
			<Typography variant='h2' gutterBottom sx={{color: '#07457E'}}>No messages yet!</Typography>
		</Box>
		)
	}

	const chat : ChatMessage[] = [...selectedChannel.chatHistory, ...messages];

	return (	
		<Box p={3}>
			<Stack spacing={3}>
				{chat
				.filter((el) => el.channelById === selectedChannel.name)
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
