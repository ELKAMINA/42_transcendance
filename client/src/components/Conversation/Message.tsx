import { Box, Stack, Typography } from '@mui/material'
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from './MsgTypes'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { DisplayedChat } from '../../types/chat/chatTypes'
import { ChatHistory_1 } from '../../data/chatHistory'

const Message = () => {

	const selectedchat = useSelector((state : RootState) => state.persistedReducer.selectedChat) as DisplayedChat | null;
	
	if (!selectedchat) {
		return null; // If selectedchat is null, don't render anything
	}

	if (!selectedchat.chatHistory) {
		return (
		<Box p={3} >
			<Typography variant='h2' gutterBottom sx={{color: '#07457E'}}>No messages yet! Say hello, don't be shy...</Typography>
		</Box>
		)
	}

	return (	
	<Box p={3} >
		<Stack spacing={3}>
		{
			ChatHistory_1.map((el) => { // el is eather a message or a divider
				switch (el.type) {
					case 'divider': 
						return <Timeline el={el} />
					case 'msg':
						switch (el.subtype) {
							case  'img':
								return <MediaMsg el={el} />
							case  'doc':
								return <DocMsg el={el} />
							case  'link':
								return <LinkMsg el={el} />
							case  'reply':
								return <ReplyMsg el={el} />
							default:
								return <TextMsg el={el} />
						}
					default:
						return <></>;
				}
			})
		}
		</Stack>
	</Box>
	)
}

export default Message
