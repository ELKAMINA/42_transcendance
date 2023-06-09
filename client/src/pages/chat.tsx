import Navbar from '../components/NavBar_0';
import SideBar from './sideBar';

function Chat () {
	const currentRoute = window.location.pathname;

	return (
		<div>
			<Navbar currentRoute={ currentRoute }/>
			<SideBar />

		</div>
	)
}

export default Chat;