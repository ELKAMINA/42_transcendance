import Navbar from '../components/NavBar';
import Message from '../components/Message'

function Chat () {
  const currentRoute = window.location.pathname;

    return (
      <>
        <Navbar currentRoute={ currentRoute }/>
        <Message/>
      </>
    )
}

export default Chat;