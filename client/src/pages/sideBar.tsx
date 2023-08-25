import { MutableRefObject, useState } from 'react';
import { Box, Button, Stack, } from '@mui/material';
import CreateChannel from './createChannel/createChannel.tsx';
import AlignItemsList from '../components/AlignItemsList.tsx';

import "./sideBar.css"
import SearchBarContainer from '../components/SearchBarContainer.tsx';
import { Socket } from 'socket.io-client';
import { setIsPopupOpen } from '../redux-features/chat/channelsSlice.tsx';
import { useAppDispatch } from '../utils/redux-hooks.tsx';

type handleSelectItemFunction = (pwd: string) => void;

interface SideBarProps {
  	handleSelectItem: handleSelectItemFunction;
	newChannelCreated: MutableRefObject<boolean>;
	channelDeleted: MutableRefObject<boolean>;
}

function SideBar({handleSelectItem, newChannelCreated, channelDeleted} : SideBarProps) {
	const [buttonPopup, setButtonPopup] = useState<boolean>(false);
	const AppDispatch = useAppDispatch();

	function getSelectedItem (selectedItem : string) {
		handleSelectItem(selectedItem)
	}

	function handleClick() {
		setButtonPopup(true);
		AppDispatch(setIsPopupOpen(true)); // to notify the Styledbadge component in <Header />
	}

	return (
	<Box className='sideBar'>
		<SearchBarContainer getSelectedItem={getSelectedItem} newChannelCreated={newChannelCreated}/>
		{/* <Divider variant='middle' flexItem  sx={{bgcolor: '#dde5ed'}}/> */}
		<Stack alignItems={'center'} direction={'row'} justifyContent={'space-between'} spacing={4}>
			<Box >
				<Button
					// onClick={() => setButtonPopup(true)}
					onClick={handleClick}
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
				<CreateChannel 
					newChannelCreated={newChannelCreated}
					getSelectedItem={getSelectedItem} 
					trigger = {buttonPopup} 
					setTrigger={setButtonPopup}
				/>
			</Box>
		</Stack>
		<Stack className='alignItemsListContainer'>
			<AlignItemsList getSelectedItem={getSelectedItem} channelDeleted={channelDeleted} />
		</Stack>
	</Box>
	);
}

export default SideBar;
