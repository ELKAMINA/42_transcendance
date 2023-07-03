import { Box, Stack, Typography } from '@mui/material'
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from './MsgTypes'
import { ChatMessage } from '../../types/chat/messageType'
import { useAppSelector } from '../../utils/redux-hooks';
import { selectDisplayedChannel } from '../../redux-features/chat/channelsSlice';
import { Channel } from '../../types/chat/channelTypes';

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

	const chat = [...selectedChannel.chatHistory, ...messages];
	
	return (	
	<Box p={3} >
		<Stack spacing={3}>
		{
			chat.map((el, index) => {
				// if (index === 0 || is24HoursApart(el.sentAt, messages[index - 1].sentAt)) {
				//   return <Timeline key={index} el={el.sentAt} />;
				// }
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
			})
		}
		</Stack>
	</Box>
	)
}

export default Message
