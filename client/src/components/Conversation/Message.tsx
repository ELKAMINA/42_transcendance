import React from 'react';
import { Box, Stack, Typography } from '@mui/material'

import { useAppSelector } from '../../utils/redux-hooks';
import { ChatMessage } from '../../types/chat/messageType'
import areDifferentDays from '../../utils/areDifferentDays';
import { ChannelModel } from '../../types/chat/channelTypes';
import { selectDisplayedChannel } from '../../redux-features/chat/channelsSlice';
import { DocMsg, InfoMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from './MsgTypes'

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

const Message = ({ messages }: { messages : ChatMessage[] }) => {

	const selectedChannel : ChannelModel = useAppSelector(selectDisplayedChannel);

	if (!selectedChannel || !selectedChannel.chatHistory) {
		return (
		<Box p={3}>
			<Typography variant="h2" gutterBottom sx={{ color: '#07457E' }}>
			{selectedChannel ? 'No messages yet!' : 'Selected channel not found!'}
			</Typography>
		</Box>
		);
	}

	const chat: ChatMessage[] = selectedChannel.chatHistory.concat(messages);

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
