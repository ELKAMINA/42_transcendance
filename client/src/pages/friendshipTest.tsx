// import './chat.css'

// import Navbar from '../components/NavBar';
// import SideBar from './sideBar';
// import Conversation from '../components/Conversation/Conversation';

// import { Provider } from 'react-redux';
// import { store } from '../app/store';
// import { Box, Stack } from '@mui/material';
// import { useAppDispatch } from "../utils/redux-hooks";
// import { useEffect, useState } from "react";

// function Friendship () {
// 	const currentRoute = window.location.pathname;
// 	const AppDispatch = useAppDispatch();
	
// 	useEffect(() => {})
  
// 	return (
//         <>
//             <Navbar currentRoute={ currentRoute }/>
//             <Stack className='chat' direction={'row'} sx={{width: '100%'}}>
//                 <SideBar handleSelectItem={handleSelectChannel} />
//                 <Box sx={{
//                     height: '95vh',
//                     width: '100vw',
//                     backgroundColor: '#fff',
//                 }}>
//                     <Conversation />
//                 </Box>
//             </Stack>
//         </>
// 	)
// }

// export default Chat;