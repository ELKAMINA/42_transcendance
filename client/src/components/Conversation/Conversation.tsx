import { Box, Stack } from "@mui/material"
import Header from "./Header"
import Footer from "./Footer"

function Conversation() {
	return (
		<Stack
			height={'100%'} 
			maxHeight={'100vh'}
			width={'auto'}
		>
			{/* chat header */}
			<Header />

			{/* Msg */}
			<Box
				width={'100%'}
				sx={{
					flexGrow:1, // ensures that the message section expands and takes up all the available vertical space between the chat header and footer.
				}}
			>
			</Box>


			{/* Chat footer */}
			<Footer />
			

		</Stack>
	)
}

export default Conversation