import styled from "@emotion/styled";
import { Box, Stack, Avatar, Badge, Typography, IconButton, Divider, TextField, InputAdornment } from "@mui/material"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';

const StyledInput = styled(TextField)(({ theme }) => ({
	backgroundColor: 'transparent',
	border: 'none',
	boxShadow: 'none',
	'& .MuiInputBase-input' : {
		paddingTop: '12px',
		paddingBottom: '12px',
		borderRadius: 'none',
		backgroundColor: 'transparent',
		border: 'none',
		boxShadow: 'none',
	}
}))

const StyledBadge = styled(Badge)(({ theme }) => ({
	"& .MuiBadge-badge": {
	  backgroundColor: "#44b700",
	  color: "#44b700",
	  boxShadow: `0 0 0 2px ${"white"}`,
	  "&::after": {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		borderRadius: "50%",
		animation: "ripple 1.2s infinite ease-in-out",
		border: "1px solid currentColor",
		content: '""',
	  },
	},
	"@keyframes ripple": {
	  "0%": {
		transform: "scale(.8)",
		opacity: 1,
	  },
	  "100%": {
		transform: "scale(2.4)",
		opacity: 0,
	  },
	},
  }));

function Conversation() {
	return (
		<Stack
			height={'100%'} 
			maxHeight={'100vh'}
			width={'auto'}
		>
			{/* chat header */}
			<Box 
				p={2}
				sx={{
					// height: 100,
					width: '100%',
					backgroundColor: '#F8FAFF',
					boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)'
				}}
			>
				<Stack alignItems={'center'} direction={'row'} justifyContent={'space-between'} sx={{width: '100%', height: '100%',}}>
					<Stack direction={'row'} spacing={2}>
						<Box>
							<StyledBadge
								overlap="circular"
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								variant="dot"
							>
								<Avatar
									alt="Rick Sanchez"
									src="/broken-image.jpg"
									sx={{ bgcolor: '#fcba03' }}
								/>
							</StyledBadge>
						</Box>
						<Stack spacing={0.2}>
								<Typography variant="subtitle2">Rick Sanchez</Typography>
								<Typography variant="caption">online</Typography>
						</Stack>
					</Stack>
					<Stack direction={'row'} alignItems={'center'} spacing={3}>
						<IconButton>
							<SportsEsportsIcon />
						</IconButton>
						<IconButton>
							<RemoveCircleIcon />
						</IconButton>
						<Divider orientation="vertical" flexItem/>
						<IconButton>
							<ExpandMoreIcon />
						</IconButton>
					</Stack>
				</Stack>
			</Box>


			{/* Msg */}
			<Box
				width={'100%'}
				sx={{
					flexGrow:1, // ensures that the message section expands and takes up all the available vertical space between the chat header and footer.
				}}
			>
			</Box>


			{/* Chat footer */}
			<Box 
				p={2}
				sx={{
					// height: 100,
					width: '100%',
					backgroundColor: '#F8FAFF',
					boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)'
				}}
			>
				<Stack direction={'row'} alignItems={'center'} spacing={3}>
					<StyledInput variant='filled' fullWidth placeholder="Write a message..."InputProps={{
						disableUnderline: true,
						endAdornment: (
							<InputAdornment position="end">
								<IconButton>
									<SentimentVerySatisfiedIcon />
								</IconButton>
							</InputAdornment>)
					}} />
					<Box sx={{
						height: 48, width: 48, backgroundColor: '#07457E', borderRadius: 1.5
					}}>
						<Stack sx={{height:'100%', width:'100%',}} alignItems={'center'} justifyContent={'center'}>
							<IconButton>
								<SendIcon fontSize="medium" sx={{color: 'white'}}/>
							</IconButton>
						</Stack>
					</Box>
				</Stack>
			</Box>
			

		</Stack>
	)
}

export default Conversation