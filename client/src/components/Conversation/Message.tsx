import { Box, Stack } from '@mui/material'
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from './MsgTypes'
import { ChatHistory } from '../../data/chatHistory'

const Message = () => {
  return (
	// column direction is given by default
	<Box p={3} >
		<Stack spacing={3}>
		{
			ChatHistory.map((el) => { // el is eather a message or a divider
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
						break;
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
