import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { channelList } from "../../data/channelList";
import { Channel } from "../../types/chat/chatTypes";
import { RootState } from "../../app/store";
import api from "../../utils/Axios-config/Axios";

export interface ChannelSlice {
	allChannels : Channel[],
	createdChannels : Channel[],
	memberedChannels : Channel[],
}

const initialState : ChannelSlice = {
	allChannels: [],
	createdChannels : [],
	memberedChannels : [],
};

// this is an array of channels
export const channelsSlice = createSlice({
	name: "channels",
	initialState,
	reducers: {

		getAllChannels: (state, action: PayloadAction<Channel[]>) => {
			state.allChannels = action.payload;
		},
		  
		getCreatedChannels: (state, action : PayloadAction<Channel[]>) => {
			state.createdChannels = action.payload
		},

		getMemberedChannels: (state, action : PayloadAction<Channel[]>) => {
			state.memberedChannels = action.payload
		},
		
		// addChannel: (state, action) => {
		// 	// {type : channels/addChannel, payload: Channel}
		// 	const newChannel = action.payload
			
		// 	// FOR DEBUG
		// 	// console.log("adding channel...");
			
		// 	state.push(newChannel);

		// 	// FOR DEBUG
		// 	// console.log("CHANNEL ADDED WITH SUCCESS!")
		// 	// console.log("Channel name : " + newChannel.name) 
		// 	// console.log("channel id = " + newChannel.id)
		// 	// console.log("channel type = " + newChannel.type)
		// 	// console.log("channel pwd = " + newChannel.password)
		// 	// console.log("channel users = " + newChannel.users[0]);
		// },
		// deleteChannel: (state, action) => {
		// 	// {type : channels/deleteChannel, payload: <id of channel to be deleted> : number}

		// 	const channelToDelete = action.payload;
		// 	const filteredChannels = state.filter(channel => channel.id !== channelToDelete);
			
		// 	// FOR DEBUG
		// 	// console.log("channel " + action.payload + " deleted !")
		// 	state.map(channel => console.log(channel.login));

		// 	// Update the state by returning a new array
  		// 	return filteredChannels;
		// },
		// deleteAllChannels: (state, action) => {
		// 	if (action.payload === true) {
		// 		// console.log("I will now delete all the channels");
		// 		state.splice(0, state.length);
		// 		// console.log("size of channels now : ", state.length);
		// 		return state;
		// 	}
		// }
	}
})


export function fetchAllChannels() {
	return async (dispatch: any, getState: any) => {
	  const requestBody = {
		login: getState().persistedReducer.auth.nickname,
	  };
	  try {
		const response = await api.post(
		  "http://localhost:4001/channel/all",
		  requestBody
		);
		console.log('response = ', response.data);
		// dispatch(getAllChannels(response.data));

	  } catch (error) {
		console.log('error', error);
	  }
	};
}

export const {getAllChannels} = channelsSlice.actions;

export default channelsSlice.reducer

export const selectAllChannels = (state: RootState) => state.persistedReducer.channels.allChannels
export const selectCreatedChannels = (state: RootState) => state.persistedReducer.channels.createdChannels
export const selectMemberedChannels = (state: RootState) => state.persistedReducer.channels.memberedChannels
