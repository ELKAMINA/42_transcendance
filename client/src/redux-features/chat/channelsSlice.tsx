import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { channelList } from "../../data/channelList";
import { Channel } from "../../types/chat/channelTypes";
import { RootState } from "../../app/store";
import api from "../../utils/Axios-config/Axios";
import { emptyChannel } from "../../data/emptyChannel";

export interface ChannelSlice {
	userChannels : Channel[],
	createdChannels : Channel[],
	memberedChannels : Channel[],
	allChannels : Channel[],
	displayedChannel : Channel,
}

const initialState : ChannelSlice = {
	userChannels: [],
	createdChannels : [],
	memberedChannels : [],
	allChannels: [],
	displayedChannel : emptyChannel,
};

// this is an array of channels
export const channelsSlice = createSlice({
	name: "channels",
	initialState,
	reducers: {

		updateUserChannels: (state, action: PayloadAction<Channel[]>) => {
			return {
				...state,
				userChannels: [...action.payload]
			}
		},
		  
		updateCreatedChannels: (state, action : PayloadAction<Channel[]>) => {
			return {
				...state,
				createdChannels: [...action.payload]
			}
		},

		updateMemberedChannels: (state, action : PayloadAction<Channel[]>) => {
			return {
				...state,
				memberedChannels: [...action.payload]
			}
		},

		updateAllChannels: (state, action: PayloadAction<Channel[]>) => {
			return {
				...state,
				allChannels: [...action.payload]
			}
		},

		updateDisplayedChannel: (state, action: PayloadAction<Channel>) => {
			return {
				...state,
				displayedChannel : action.payload
			}
		}
	}
})

export function fetchUserChannels() {
	return async (dispatch: any, getState: any) => {
		const requestBody = {
			login: getState().persistedReducer.auth.nickname,
	  	};
	  try {
			const response = await api.post(
				"http://localhost:4001/channel/userchannels",
				requestBody
			);
			// console.log('getting channels from database = ', response.data);
			dispatch(updateUserChannels(response.data));

	  } catch (error) {
			console.log('error while getting channels from database', error);
	  }
	};
}

export function fetchCreatedByUserChannels() {
	return async (dispatch: any, getState: any) => {

		const requestBody = {
			login: getState().persistedReducer.auth.nickname,
		};

		try {
		const response = await api.post(
			"http://localhost:4001/channel/createdby",
			requestBody
		);
		// console.log('getting created by user channels from database = ', response.data);
			dispatch(updateCreatedChannels(response.data));

		} catch (error) {
			console.log('error while getting ccreated by user channels from database', error);
		}
	};
}

export function fetchUserIsAMemberChannels() {
	return async (dispatch: any, getState: any) => {

		const requestBody = {
			login: getState().persistedReducer.auth.nickname,
		};

		try {
			const response = await api.post(
				"http://localhost:4001/channel/ismember",
				requestBody
			);
			console.log('getting is member channels from database = ', response.data);
			dispatch(updateMemberedChannels(response.data));
		} catch (error) {
			console.log('error while getting is member channels from database', error);
		}
	};
}

export function fetchAllChannelsInDatabase() {
	return async (dispatch: any, getState: any) => {
		try {
			const response = await api.post("http://localhost:4001/channel/all",);
			dispatch(updateAllChannels(response.data));

		} catch (error) {
			console.log('error while getting all channels from database', error);
		}
	};
}

export function fetchDisplayedChannel(name : string) {
	return async (dispatch: any, getState: any) => {
		const requestBody = {
			name: name,
		}
		try {
			const response = await api.post("http://localhost:4001/channel/displayed", requestBody);
			dispatch(updateDisplayedChannel(response.data));

		} catch (error) {
			console.log('error while getting displayed channel from database', error);
		}
	};
}

export const {updateUserChannels, updateCreatedChannels, updateMemberedChannels, updateAllChannels, updateDisplayedChannel} = channelsSlice.actions;

export default channelsSlice.reducer

export const selectUserChannels = (state: RootState) => state.persistedReducer.channels.userChannels
export const selectCreatedChannels = (state: RootState) => state.persistedReducer.channels.createdChannels
export const selectMemberedChannels = (state: RootState) => state.persistedReducer.channels.memberedChannels
export const selectAllChannels = (state: RootState) => state.persistedReducer.channels.allChannels
export const selectDisplayedChannel = (state: RootState) => state.persistedReducer.channels.displayedChannel