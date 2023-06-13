import { createSlice } from "@reduxjs/toolkit";
import { channelList, Channel } from "../../data/channelList";

const initialState: Channel[] = channelList;

export const channelSlice = createSlice({
	name: "channel",
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

export const { addChannel, deleteChannel } = channelSlice.actions

export default channelSlice.reducer