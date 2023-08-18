import { MutableRefObject, useState } from 'react';
import { Box, Button, Stack, } from '@mui/material';
import CreateChannel from './createChannel/createChannel.tsx';
import AlignItemsList from '../components/AlignItemsList.tsx';

import "./sideBar.css"
import SearchBarContainer from '../components/SearchBarContainer.tsx';
import { Socket } from 'socket.io-client';

type handleSelectItemFunction = (pwd: string) => void;

interface SideBarProps {
  	handleSelectItem: handleSelectItemFunction;
	socketRef: React.MutableRefObject<Socket | undefined>;
	newChannelCreated: MutableRefObject<boolean>;
}

function SideBar({handleSelectItem, socketRef, newChannelCreated} : SideBarProps) {
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
				<CreateChannel newChannelCreated={newChannelCreated} getSelectedItem={getSelectedItem} trigger = {buttonPopup} setTrigger={setButtonPopup} />
			</Box>
		</Stack>
		<Stack className='alignItemsListContainer'>
			<AlignItemsList getSelectedItem={getSelectedItem} socketRef={socketRef} />
		</Stack>
	</Box>
	);
}

export default SideBar;
