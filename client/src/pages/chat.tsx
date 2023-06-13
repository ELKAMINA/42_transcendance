import { Provider } from 'react-redux';
import Navbar from '../components/NavBar_0';
import SideBar from './sideBar';
import { store } from '../app/store';

function Chat () {
	const currentRoute = window.location.pathname;

	return (
		<Provider store={store}>
			<div>
				<Navbar currentRoute={ currentRoute }/>
				<SideBar />
			</div>
		</Provider>
	)
}

export default Chat;