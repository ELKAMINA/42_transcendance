import React, { useState } from 'react';

import { Box, Stack } from '@mui/material';

// import { Search, SearchIconWrapper, StyledInputBase } from './search';

import { User } from '../data/userList.ts'
import SearchBar from './search/searchBar.tsx';
import { SearchResultsList } from './search/searchResultsList.tsx';

interface Channel {
  id: number;
  name: string;
}

function SideBar() {

	// set up an array of channels
	const [channels, setChannels] = useState<Channel[]>([]);

	// set up a variable for the selected channel
	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

	// create new channel -- TO DO : USE REDUX
	const handleCreateChannel = () => 
	{
		// add new channel object
		const newChannel: Channel = {
			id: channels.length + 1,
			name: `Channel ${channels.length + 1}`
		};

		for (const chan of channels)
			console.log(chan);

		// update the array of channels
		setChannels([...channels, newChannel]);
	};

	// define what to do when a channel is selected
	const handleSelectChannel = (channel: Channel | null) => {
		setSelectedChannel(channel);
	};

	const [results, setResults] = useState<User[]>([])

	return (
	<div>
		<Box sx={{
			position: "absolute",
			height: "100%", 
			width: 320, 
			backgroundColor: "#F8FAFF", 
			boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25'
			}}>

			<Stack sx={{width: "100%", marginTop: "50px"}}>
				<SearchBar setResults={setResults}/>
				<SearchResultsList results={results}/>
			</Stack>

			<Stack>
				<button onClick={handleCreateChannel}>CREATE CHANNEL</button>
				<select 
					value={selectedChannel?.id || ''} 
					onChange={(e) => handleSelectChannel(channels.find(channel => 
						channel.id === parseInt(e.target.value)) 
						|| null)}
				>
				</select>
			</Stack>

			{/* <Stack>
					{channels.map(channel => (
						<option key={channel.id} value={channel.id}>{channel.name}</option>
					))}
				
			</Stack> */}

		</Box>

	</div>
	);
}

export default SideBar;
