import { Box, Stack } from "@mui/material"
import Header from "./Header"
import Footer from "./Footer"
import Message from "./Message"

function Conversation() {
	return (
		<Stack
			height={'100%'} 
			maxHeight={'100vh'}
			width={'auto'}
		>
			<Header />
			{/* Msg */}
			<Box
				width={'100%'}
				sx={{
					flexGrow:1, // ensures that the message section expands and takes up all the available vertical space between the chat header and footer.
				}}
			>
				<Message />
			</Box>
			<Footer />
		</Stack>
	)
}

export default Conversation