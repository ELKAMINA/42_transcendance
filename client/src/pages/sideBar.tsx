import { useState } from 'react';
import CreateChannel from './createChannel/createChannel.tsx';
import AlignItemsList from '../components/AlignItemsList.tsx';
import { Box, Button, Stack, } from '@mui/material';
import "./sideBar.css"
import api from '../utils/Axios-config/Axios.tsx';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks.tsx';
import { fetchUserChannels } from '../redux-features/chat/channelsSlice.tsx';
import { selectCurrentUser } from '../redux-features/auth/authSlice.tsx';
import SearchBarContainer from '../components/SearchBarContainer.tsx';

type handleSelectItemFunction = (pwd: string) => void;

interface SideBarProps {
  handleSelectItem: handleSelectItemFunction;
}

function SideBar({handleSelectItem} : SideBarProps) {
	const AppDispatch = useAppDispatch();
	const nickname : string = useAppSelector(selectCurrentUser)
	// button that opens the create channel window
	const [buttonPopup, setButtonPopup] = useState<boolean>(false);

	function getSelectedItem (selectedItem : string) {
		handleSelectItem(selectedItem)
	}

	return (
	<Box className='sideBar'>
		<SearchBarContainer getSelectedItem={getSelectedItem} />
		{/* <Divider variant='middle' flexItem  sx={{bgcolor: '#dde5ed'}}/> */}
		<Stack alignItems={'center'} direction={'row'} justifyContent={'space-between'} spacing={4}>
			<Box >
				<Button
					onClick={() => setButtonPopup(true)}
					variant='contained'
					sx={{
						margin:'8%',
						marginLeft: '0%',
						padding: '3%',
						width: '15vw',
						color: '#07457E',
						backgroundColor: '#99E100',
						fontWeight: '900',
						fontSize: '1em',
						'&:hover': {
							backgroundColor: 'white',
							boxShadow: 'none',
						},
					}}
				>
					CREATE CHANNEL
				</Button>
				<CreateChannel trigger = {buttonPopup} setTrigger={setButtonPopup} />
			</Box>
		</Stack>
		<Stack className='alignItemsListContainer'>
			<AlignItemsList getSelectedItem={getSelectedItem} />
		</Stack>
	</Box>
	);
}

export default SideBar;
