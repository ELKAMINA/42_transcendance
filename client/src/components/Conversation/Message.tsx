import { Box, Stack } from '@mui/material'
import { MediaMsg, TextMsg, Timeline } from './MsgTypes'
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
								// image message
								return <MediaMsg el={el}/>
							case  'doc':
								// image message
								break;
							case  'link':
								// image message
								break;
							case  'reply':
								// image message
								break;
							default:
								// texte message
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
