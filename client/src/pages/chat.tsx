import { Provider } from 'react-redux';
import Navbar from '../components/NavBar';
import SideBar from './sideBar';
import { store } from '../app/store';
import { Box, Grid, Stack } from '@mui/material';
import Conversation from '../components/Conversation';
import './chat.css'

function Chat () {
	const currentRoute = window.location.pathname;
  
	return (
		<Provider store={store}>
			<Navbar currentRoute={ currentRoute }/>
			<Stack className='chat' direction={'row'} sx={{width: '100%'}}>
				<SideBar />
				<Box sx={{
					height: '95vh',
					width: '100vw',
					backgroundColor: '#fff',
				}}>
					<Conversation />
				</Box>
			</Stack>
		</Provider>


		// {/* <Box> */}
		// {/* <Box */}
		// 	// sx={{
		// 		// height:'100%',
		// 		// width:'75vw',
		// 		// backgroundColor: 'black',
		// 	// }}
		// {/* > */}
		// {/* </Box> */}
		// {/* </Box> */}


		// 	{/* <Grid container sx={{ height: '100vh' }}> */}
		// 		{/* <Grid item xs={12}> */}
		// 			{/* <Navbar currentRoute={currentRoute} /> */}
		// 		{/* </Grid> */}
		// 		{/* <Grid item> */}
		// 			{/* <SideBar /> */}
		// 		{/* </Grid> */}
		// 		{/* <Grid item xs='auto' */}
		// 			// sx={{
		// 				// backgroundColor: 'black',
		// 				// height: '100%',
		// 				// width: '85vw',
		// 				// }}
		// 		// >
		// 		{/* </Grid> */}
		// 	{/* </Grid> */}
		// {/* </Provider> */}

	)
}

export default Chat;