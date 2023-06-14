import { createSlice } from "@reduxjs/toolkit";
import { channelList, Channel } from "../../data/channelList";

const initialState: Channel[] = channelList;

// this is an array of channels
export const channelsSlice = createSlice({
	name: "channels",
	initialState,
	reducers: {
		addChannel: (state, action) => {
			// {type : channels/addChannel, payload: Channel}
			const newChannel = action.payload
			console.log("adding channel...");
			state.push(newChannel);
			console.log("CHANNEL ADDED WITH SUCCESS!")
			console.log("Channel name : " + newChannel.name) 
			console.log("channel id = " + newChannel.id)
			console.log("channel type = " + newChannel.type)
			console.log("channel pwd = " + newChannel.password)
			// console.log("channel users = " + newChannel.users[0]);
		},
		deleteChannel: (state, action) => {
			// {type : channels/deleteChannel, payload: <name>}
			state = state.filter(channel => channel.name !== action.payload);
		}
	}
})

export const { addChannel, deleteChannel } = channelsSlice.actions

export default channelsSlice.reducer