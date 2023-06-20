import React, { useState } from 'react';

import CreateChannel from './createChannel/createChannel.tsx';
import SearchBar from './search/searchBar.tsx';
import SearchResultsList from './search/searchResultsList.tsx';

import "./sideBar.css"
import { useSelector } from 'react-redux';
import { RootState } from '../app/store.tsx';
import { UserDetails } from "../../../server/src/user/types/user-types.user.ts";
import AlignItemsList from '../components/AlignItemsList.tsx';
import { Box, Button, Stack, Divider, Tooltip, IconButton } from '@mui/material';
import ConfirmationDialog from '../components/ConfirmationDialog.tsx';


interface Channel {
	name: string;
	id: number;
	type: string;
	protected_by_password: boolean
	password: string,
	userList: UserDetails[]
  }

function SideBar() {
	// the list of the channels
	const channels = useSelector((state: RootState) => state.persistedReducer.channels);

	// button that opens the create channel window
	const [buttonPopup, setButtonPopup] = useState<boolean>(false);
	
	// the userList for the search bar
	const [results, setResults] = useState<UserDetails[]>([])

	// set up a variable for the selected channel
	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

	// define what to do when a channel is selected
	const handleSelectChannel = (channel: Channel | null) => {
		setSelectedChannel(channel);
	};
	
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
				<ConfirmationDialog />
			</Box>
		</Stack>
		<Stack className='alignItemsListContainer'>
			<AlignItemsList />
		</Stack>
	</Box>
	);
}

export default SideBar;
