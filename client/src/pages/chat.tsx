import Navbar from '../components/NavBar_0';

function Chat () {
  const currentRoute = window.location.pathname;

    return (
      <>
        <Navbar currentRoute={ currentRoute }/>
      </>
    )
}

export default Chat;