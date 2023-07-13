import React, { useState } from 'react';

import CreateChannel from './createChannel/createChannel.tsx';
import SearchBar from './search/searchBar.tsx';
import SearchResultsList from './search/searchResultsList.tsx';
import ConfirmationDialog from '../components/ConfirmationDialog.tsx';
import AlignItemsList from '../components/AlignItemsList.tsx';
import { Box, Button, Stack, Divider } from '@mui/material';
import { UserDetails } from "../../../server/src/user/types/user-types.user.ts";
import ClearAllIcon from '@mui/icons-material/ClearAll';

import "./sideBar.css"
import { Channel } from '../types/chat/channelTypes.ts';
import api from '../utils/Axios-config/Axios.tsx';
import { useAppDispatch, useAppSelector } from '../utils/redux-hooks.tsx';
import { fetchUserChannels } from '../redux-features/chat/channelsSlice.tsx';
import { selectCurrentUser } from '../redux-features/auth/authSlice.tsx';

type handleSelectItemFunction = (pwd: string) => void;

interface SideBarProps {
  handleSelectItem: handleSelectItemFunction;
}

function SideBar({handleSelectItem} : SideBarProps) {
	const AppDispatch = useAppDispatch();
	const nickname = useAppSelector(selectCurrentUser) as string
	// button that opens the create channel window
	const [buttonPopup, setButtonPopup] = useState<boolean>(false);
	
	// the userList for the search bar
	const [results, setResults] = useState<(UserDetails | Channel)[]>([])
	
	function getSelectedItem (selectedItem : string) {
		handleSelectItem(selectedItem)
	}

	async function deleteAllChannels() {
		await api
			.post('http://localhost:4001/channel/deleteAllChannels', {createdBy: nickname})
			.then((response) => {
				AppDispatch(fetchUserChannels());
			})
			.catch((error) => console.log('error while deleting channel', error));
	}

	function handleClick() {
		deleteAllChannels()
	}

	return (
	<Box className='sideBar'>
		<Stack className='search-bar-container'>
			<SearchBar content="Look for user, channel..." setResults={setResults} />
			<SearchResultsList results={results}/>
		</Stack>
		<Divider variant='middle' flexItem  sx={{bgcolor: '#dde5ed'}}/>
		<Stack alignItems={'center'} direction={'row'} justifyContent={'space-between'} spacing={4}>
			<Box className='createChannelButtonWrapper'>
				<Button
					onClick={() => setButtonPopup(true)}
					variant='contained'
					// size='large'
					sx={{
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
			<Box>
				<ConfirmationDialog
					title = 'delete all'
					id = 'delete-channels'
					options = { ['Yes, I want to delete all the channels I created.'] }
					icon={<ClearAllIcon sx={{ color: 'white' }} fontSize="medium" />}
					handleConfirm={handleClick}
					dialogTitle='Delete all channels from database?'
				/>
			</Box>
		</Stack>
		<Stack className='alignItemsListContainer'>
			<AlignItemsList getSelectedItem={getSelectedItem} />
		</Stack>
	</Box>
	);
}

export default SideBar;
