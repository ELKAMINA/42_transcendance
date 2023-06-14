import { createSlice } from "@reduxjs/toolkit";
import { channelList, Channel } from "../../data/channelList";

const initialState: Channel[] = channelList;

// this is an array of channels
export const channelsSlice = createSlice({
	name: "channels",
	initialState,
	reducers: {
		addChannel: (state, action) => {
			// {type : channel/addChannel, payload: Channel}
			const newChannel = action.payload			
			console.log("new channel added : ", newChannel);
			state.push(newChannel);
		},
		deleteChannel: (state, action) => {
			// {type : channel/deleteChannel, payload: <name>}
			state = state.filter(channel => channel.name !== action.payload);
		}
	}
})

export const { addChannel, deleteChannel } = channelsSlice.actions

export default channelsSlice.reducer