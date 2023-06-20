import { Provider } from 'react-redux';
import Navbar from '../components/NavBar';
import SideBar from './sideBar';
import { store } from '../app/store';
import { Box, Grid } from '@mui/material';

function Chat () {
	const currentRoute = window.location.pathname;

	return (
		<Provider store={store}>
			<Grid container sx={{ height: '100vh' }}>
				<Grid item xs={12}>
					<Navbar currentRoute={currentRoute} />
				</Grid>
				<Grid item>
					<SideBar />
				</Grid>
				<Grid item xs={true}>
					<Box
						sx={{
						backgroundColor: '#ffff',
						height: '100%',
						}}
					></Box>
				</Grid>
			</Grid>
		</Provider>
	)
}

export default Chat;