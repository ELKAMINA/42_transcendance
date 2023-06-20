import React, { useState } from 'react';

import CreateChannel from './createChannel/createChannel.tsx';
import SearchBar from './search/searchBar.tsx';
import SearchResultsList from './search/searchResultsList.tsx';

import "./sideBar.css"
import { useSelector } from 'react-redux';
import { RootState } from '../app/store.tsx';
import { UserDetails } from "../../../server/src/user/types/user-types.user.ts";
import AlignItemsList from '../components/ChannelDisplayList.tsx';
import { Box, Button, Grid, Stack } from '@mui/material';

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

		<Stack className='createChannelButtonWrapper'>
			<Button
				onClick={() => setButtonPopup(true)}
				variant='contained'
				size='large'
				sx={{
					color: '#ac0404',
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
		</Stack>

		<Stack className='alignItemsListContainer' sx= {{
			  overflowY: "auto", //  a scrollbar will appear when the content exceeds the element's height.
			  margin: 0,
			  padding: 0,
			  listStyle: "none", //  Removes the default list-style (bullet points) from the element.
			  height: "100%",
			  '&::-webkit-scrollbar': { // Selects the scrollbar pseudo-element for webkit-based browsers (e.g., Chrome, Safari).
				width: '0.5em', // Sets the width of the scrollbar to 0.4em.
				border: 'none',

			  },
			  '&::-webkit-scrollbar-track': { //  Selects the track (background) of the scrollbar
				boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)', // Applies an inset box shadow to the scrollbar track.
				webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)' //  Applies an inset box shadow to the scrollbar track specifically for webkit-based browsers.
			  },
			  '&::-webkit-scrollbar-thumb': { //  Selects the thumb (scrolling handle) of the scrollbar.
				backgroundColor: '#e6ebea', // Sets the background color of the scrollbar thumb to a semi-transparent black color.
				borderRadius: '20px',
				border: 'none',
			  }
		}}>
			<AlignItemsList />
		</Stack>
	</Box>
	);
}

export default SideBar;
