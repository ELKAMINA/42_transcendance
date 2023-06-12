import React, { useState } from 'react';

import { Box, Stack } from '@mui/material';

import "./sideBar.css"

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
	<div className='sideBar'>
		<div className='search-bar-container'>
			<SearchBar setResults={setResults}/>
			<SearchResultsList results={results}/>
		</div>

		<div>
			<button onClick={handleCreateChannel}>CREATE CHANNEL</button>
			<select 
				value={selectedChannel?.id || ''} 
				onChange={(e) => handleSelectChannel(channels.find(channel => 
					channel.id === parseInt(e.target.value)) 
					|| null)}
			>
			</select>
		</div>

		{/* <div>
				{channels.map(channel => (
					<option key={channel.id} value={channel.id}>{channel.name}</option>
				))}
			
		</div> */}
	</div>
	);
}

export default SideBar;
