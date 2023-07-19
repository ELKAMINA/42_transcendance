import './chat.css'
import { Box, Stack } from '@mui/material';
import Navbar from '../components/NavBar'; 

import { Provider } from 'react-redux';
import { store } from '../app/store';

function MatchMaking () {
	const currentRoute = window.location.pathname;
	// const AppDispatch = useAppDispatch();

	return (
		<Provider store={store}>
			<Box>
                <Stack>
				    <Navbar currentRoute={currentRoute} />
                </Stack>
                <Stack>
				    <h1> Looking for your ennemy </h1>
                </Stack>
			</Box>
		</Provider>
	)
}

export default MatchMaking;