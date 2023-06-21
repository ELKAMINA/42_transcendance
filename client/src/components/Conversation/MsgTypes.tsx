import { Stack, Divider, Typography, Box } from '@mui/material';
import { Sep, ChatMessage } from '../../data/chatHistory';

type TextMsgProps = {
	el: ChatMessage;
}

const ReplyMsg = ({el} : TextMsgProps) => {
	return (
		<Stack
			direction={'row'}
			justifyContent={el.incoming? 'start' : 'end'}
		>
			<Box p={1.5} sx={{
					backgroundColor: el.incoming? '#07457E' : '#f2f4f5',
					borderRadius: 1.5, // 1.5 * 8 => 12px
					width: 'max-content'
				}}
			>
			</Box>
		</Stack>
	)
}

const MediaMsg = ({el} : TextMsgProps) => {
	return (
		<Stack
			direction={'row'}
			justifyContent={el.incoming? 'start' : 'end'}
		>
			<Box p={1.5} sx={{
					backgroundColor: el.incoming? '#07457E' : '#f2f4f5',
					borderRadius: 1.5, // 1.5 * 8 => 12px
					width: 'max-content'
				}}
			>
				<Stack spacing={1}>
					<img src={el.img} alt={el.message} style={{maxHeight: 210, borderRadius: '10px'}} />
				</Stack>
				<Typography
					variant='body2'
					color={ el.incoming? '#f2f4f5' : '#07457E' }
				>
					{el.message}
				</Typography>
			</Box>
		</Stack>
	)
}

const TextMsg = ({el} : TextMsgProps) => {
  return (
	<Stack
		direction={'row'}
		justifyContent={el.incoming? 'start' : 'end'}
	>
		<Box p={1.5} sx={{
				backgroundColor: el.incoming? '#07457E' : '#f2f4f5',
				borderRadius: 1.5, // 1.5 * 8 => 12px
				width: 'max-content'
			}}
		>
			<Typography
				variant='body2'
				color={ el.incoming? '#f2f4f5' : '#07457E' }
			>
				{el.message}
			</Typography>
		</Box>
	</Stack>
  )	
}

type TimelineProps = {
	el: Sep;
};

const Timeline = ({el} : TimelineProps) => {
	
  return (
	<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
	  {/* <Divider sx={{width: '100%',}}>{el.text}</Divider> */}

	  <Divider sx={{width: '46%',}} />
	  	<Typography
			variant='caption'
			sx={{color: '#475d70'}}
		>{el.text}</Typography>
	  <Divider sx={{width: '46%',}} />

	</Stack >
  )
  
}

export { Timeline, TextMsg, MediaMsg, ReplyMsg };