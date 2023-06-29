import { Box, Stack, Typography } from '@mui/material'
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from './MsgTypes'
import { ChatMessage } from '../../types/chat/messageType'
import { useAppSelector } from '../../utils/redux-hooks';
import { selectDisplayedChannel } from '../../redux-features/chat/channelsSlice';
import { Channel } from '../../types/chat/channelTypes';

const Message = ({ messages }: { messages : ChatMessage[] }) => {

	const selectedChannel : Channel = useAppSelector((state) => selectDisplayedChannel(state));
	console.log('selected channel in messages = ', selectedChannel);
	console.log('chat history = ', selectedChannel.chatHistory);

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

	const concatenatedChatHistory = [...selectedChannel.chatHistory, ...messages];

	return (	
	<Box p={3} >
		<Stack spacing={3}>
		{
			concatenatedChatHistory.map((el, index) => {
				if (index === 0 || is24HoursApart(el.sentAt, concatenatedChatHistory[index - 1].sentAt)) {
				  return <Timeline el={concatenatedChatHistory[index - 1].sentAt} />;
				} else {
					switch (el.subtype) {
						case 'img':
							return <MediaMsg el={el} />;
						case 'doc':
							return <DocMsg el={el} />;
						case 'link':
							return <LinkMsg el={el} />;
						case 'reply':
							return <ReplyMsg el={el} />;
						default:
							return <TextMsg el={el} />;
						}
				}
			})
		}
		</Stack>
	</Box>
	)
}

export default Message
