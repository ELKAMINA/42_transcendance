import Link from '@mui/material/Link';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';
import { format, isYesterday, isSameDay } from 'date-fns'
import { Stack, Divider, Typography, Box, IconButton } from '@mui/material';

import { RootState } from '../../app/store';
import { useAppSelector } from '../../utils/redux-hooks';
import { ChatMessage } from '../../types/chat/messageType';
import { selectCurrentUser } from '../../redux-features/auth/authSlice';

type TextMsgProps = {
	el: ChatMessage;
}

const DocMsg = ({ el }: TextMsgProps) => {

	const currentUser = useAppSelector((state : RootState) => selectCurrentUser(state));

	return (
		<Stack
			direction={'column'}
			justifyContent={el.sentById === currentUser ? 'start' : 'end'}
			spacing={0.3}
		>
			<Box px={1.5} py={1.5} sx={{
					backgroundColor: 'transparent',
					// borderRadius: 1.5, // 1.5 * 8 => 12px
					width: 'max-content',
					padding: '0px',
				}}
			>
				<Stack spacing={2}>
					<Stack
						p={2}
						direction="row"
						spacing={3}
						alignItems="center"
						sx={{
							backgroundColor: el.sentById === currentUser? '#07457E' : '#f2f4f5',
							borderRadius: 1,
						}}
					>
						<ImageIcon fontSize='large' sx={{color: 'white'}}/>
						<Typography variant="caption" color={ el.sentById === currentUser ? '#f2f4f5' : '#07457E' }>Abstract.png</Typography>
						<IconButton>
							<DownloadIcon sx={{color: 'white'}}/>
						</IconButton>
					</Stack>
				</Stack>
				</Box>
				<Box px={1.5} py={1.5} sx={{
					backgroundColor: el.sentById === currentUser? '#07457E' : '#f2f4f5',
					borderRadius: 1.5, // 1.5 * 8 => 12px
					width: 'max-content'
				}}
			>
					<Stack spacing={1}>
						<Typography
							variant='body2'
							color={ el.sentById === currentUser? '#f2f4f5' : '#07457E' }
						>
							{el.message}
						</Typography>
					</Stack>
				</Box>
					{/* {menu && <MessageOption />} */}
	  </Stack>
	);
  };

const LinkMsg = ({el} : TextMsgProps) => {
	return (
		<Stack
			direction={'column'}
			justifyContent={el.incoming? 'start' : 'end'}
			spacing={0.3}
		>
			<Box px={1.5} py={1.5} sx={{
					backgroundColor: 'transparent',
					// borderRadius: 1.5, // 1.5 * 8 => 12px
					width: 'max-content',
					padding: '0px',
				}}
			>
				<Stack spacing={2}>
					<Stack p={2} spacing={3} alignItems={'start'} sx={{
						backgroundColor:'#a6b586',
						borderRadius: 1,
					}}>
						<img src={el.preview} alt={el.message} style={{maxHeight: 200, borderRadius: '12px'}}/>
						<Stack>
							<Typography variant='subtitle2' color='#ffff'>Creating chat app youpiii</Typography>
							<Link href='https://www.youtube.com/' variant='subtitle2' color='#007a6c'>www.youtube.com</Link>
						</Stack>
					</Stack>
				</Stack>
			</Box>
			<Box px={1.5} py={1.5} sx={{
					backgroundColor: el.incoming? '#07457E' : '#f2f4f5',
					borderRadius: 1.5, // 1.5 * 8 => 12px
					width: 'max-content'
				}}
			>
				<Stack spacing={1}>
					<Typography
						variant='body2'
						color={ el.incoming? '#f2f4f5' : '#07457E' }
					>
						{el.message}
					</Typography>
				</Stack>
			</Box>
	  	</Stack>
	)	
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
				<Stack spacing={2}>
					<Stack p={2} direction={'column'} spacing={3} alignItems={'center'} sx={{
						backgroundColor: '#739fc7',
						borderRadius: 1,
					}}>
						<Typography
							variant='body2'
							color='#f2f4f5'
						>
							{el.message}
						</Typography>
					</Stack>
					<Typography
							variant='body2'
							color={ el.incoming? '#f2f4f5' : '#07457E' }
						>
							{el.reply}
					</Typography>
				</Stack>
			</Box>
		</Stack>
	)
}

const MediaMsg = ({el} : TextMsgProps) => {
	return (
		<Stack
			direction={'column'}
			spacing={0.3}
			justifyContent={el.incoming? 'start' : 'end'}
		>
			<Box p={1.5} sx={{
					backgroundColor: 'transparent',
					// borderRadius: 1.5, // 1.5 * 8 => 12px
					width: 'max-content',
					padding: '0px',
				}}
			>
				<Stack spacing={1}>
					<img src={el.img} alt={el.message} style={{maxHeight: 300, borderRadius: '5px'}} />
				</Stack>
			</Box>
			<Box p={1.5} sx={{
					backgroundColor: el.incoming? '#07457E' : '#f2f4f5',
					borderRadius: 1.5, // 1.5 * 8 => 12px
					width: 'max-content'
				}}
			>
				<Stack spacing={1}>
					<Typography
						variant='body2'
						color={ el.incoming? '#f2f4f5' : '#07457E' }
					>
						{el.message}
					</Typography>
				</Stack>
			</Box>
		</Stack>
	)
}

const InfoMsg = ({el} : TextMsgProps) => {
	return (
	  <Stack
		  direction={'row'}
		  justifyContent={el.incoming? 'start' : 'end'}
	  >
		  <Box p={1.5} sx={{
				  backgroundColor: 'transparent',
				  borderRadius: 1.5, // 1.5 * 8 => 12px
				  width: 'max-content'
			  }}
		  >
			  <Typography
				  variant='body2'
				  color={ el.incoming? '#15176b' : '#07457E' }
				  sx={{
					fontStyle: 'italic',
				  }}
			  >
				  {el.message}
			  </Typography>
		  </Box>
	  </Stack>
	)	
}

const TextMsg = ({el} : TextMsgProps) => {

	const currentUser : string = useAppSelector((state : RootState) => selectCurrentUser(state));
	const incoming : boolean = el.sentById === currentUser ? false : true;

  return (
	<Stack
		direction={'row'}
		justifyContent={incoming? 'start' : 'end'}
	>
		<Stack
			direction={'column'}
			justifyContent={'space-evenly'}
		>
			{incoming && <Box p={1} sx={{
				backgroundColor: 'transparent',
				borderRadius: 1.5, // 1.5 * 8 => 12px
				width: 'max-content'
			}}
			>
				<Typography
					variant='body2'
					color={'#07457E'}
				>
					{el.sentById}
				</Typography>
			</Box>}
			<Box p={1.5} sx={{
				backgroundColor: incoming? '#07457E' : '#f2f4f5', //ca marche
				borderRadius: 1.5, // 1.5 * 8 => 12px
				width: 'max-content'
			}}
			>
				<Typography
					variant='body2'
					color={ incoming? '#f2f4f5' : '#07457E' } //ca marche
				>
					{el.message}
				</Typography>
			</Box>

		</Stack>
	</Stack>

  )	
}

type TimelineProps = {
	date: Date
};

const Timeline = ({ date }: TimelineProps) => {
//   console.log('date = ', date);
  const currentDate = new Date(date);
  const today = new Date(); // Get the current date and time
//   console.log('today = ', today)
  let formattedDate;

//   console.log('current date = ', currentDate);
//   console.log('isToday(currentDate) = ', isSameDay(currentDate, today));

  if (isSameDay(currentDate, today)) {
    formattedDate = 'today';
  } else if (isYesterday(currentDate)) {
    formattedDate = 'yesterday';
  } else {
    formattedDate = format(currentDate, 'dd-MM-yyyy');
  }

  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
      {/* <Divider sx={{width: '100%',}}>{el.text}</Divider> */}
      <Divider sx={{width: '46%',}} />
      <Typography variant='caption' sx={{color: '#475d70'}}>
        {formattedDate}
      </Typography>
      <Divider sx={{width: '46%',}} />
    </Stack>
  );
};



export { Timeline, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg, InfoMsg };