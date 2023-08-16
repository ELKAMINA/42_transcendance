import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { channelList } from "../../data/channelList";
import { ChannelModel } from "../../types/chat/channelTypes";
import { RootState } from "../../app/store";
import api from "../../utils/Axios-config/Axios";
import { emptyChannel } from "../../data/emptyChannel";

export interface ChannelSlice {
	userChannels : ChannelModel[],
	createdChannels : ChannelModel[],
	memberedChannels : ChannelModel[],
	allChannels : ChannelModel[],
	displayedChannel : ChannelModel,
	privateChannels : ChannelModel[],
	publicChannels : ChannelModel[],
	privateConvs : ChannelModel[],
	userPrivateChannels : ChannelModel[],
	userPublicChannels : ChannelModel[],
	userPrivateConvs : ChannelModel[],

}

const initialState : ChannelSlice = {
	userChannels: [],
	createdChannels : [],
	memberedChannels : [],
	allChannels: [],
	displayedChannel : emptyChannel,
	privateChannels : [],
	publicChannels : [],
	privateConvs : [],
	userPrivateChannels : [],
	userPublicChannels : [],
	userPrivateConvs : [],

};

// this is an array of channels
export const channelsSlice = createSlice({
	name: "channels",
	initialState,
	reducers: {

		updateUserChannels: (state, action: PayloadAction<ChannelModel[]>) => {
			return {
				...state,
				userChannels: [...action.payload]
			}
		},
		  
		updateCreatedChannels: (state, action : PayloadAction<ChannelModel[]>) => {
			return {
				...state,
				createdChannels: [...action.payload]
			}
		},

		updateMemberedChannels: (state, action : PayloadAction<ChannelModel[]>) => {
			return {
				...state,
				memberedChannels: [...action.payload]
			}
		},

		updateAllChannels: (state, action: PayloadAction<ChannelModel[]>) => {
			return {
				...state,
				allChannels: [...action.payload]
			}
		},

		updateDisplayedChannel: (state, action: PayloadAction<ChannelModel>) => {
			return {
				...state,
				displayedChannel : action.payload
			}
		},

		updatePrivateChannels: (state, action: PayloadAction<ChannelModel[]>) => {
			return {
				...state,
				privateChannels : action.payload
			}
		},

		updatePublicChannels: (state, action: PayloadAction<ChannelModel[]>) => {
			return {
				...state,
				publicChannels : action.payload
			}
		},

		updatePrivateConvs: (state, action: PayloadAction<ChannelModel[]>) => {
			return {
				...state,
				privateConvs : action.payload
			}
		},
		updateUserPrivateChannels: (state, action: PayloadAction<ChannelModel[]>) => {
			return {
				...state,
				userPrivateChannels : action.payload
			}
		},

		updateUserPublicChannels: (state, action: PayloadAction<ChannelModel[]>) => {
			return {
				...state,
				userPublicChannels : action.payload
			}
		},

		updateUserPrivateConvs: (state, action: PayloadAction<ChannelModel[]>) => {
			return {
				...state,
				userPrivateConvs : action.payload
			}
		},
		resetChannelStore : (state) => {
            return initialState;
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
			console.log('error while getting created by user channels from database', error);
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
			// console.log('getting is member channels from database = ', response.data);
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
			console.log(`error while getting displayed channel ${requestBody.name} from database`, error);
		}
	};
}

// fetch all the private chan for which the user is a member or a creator
export function fetchUserPrivateChannels() {
	return async (dispatch: any, getState: any) => {
		const requestBody = {
			login: getState().persistedReducer.auth.nickname,
	  	};
	  try {
			const response = await api.post(
				"http://localhost:4001/channel/fetchUserPrivateChannels",
				requestBody
			);
			// console.log('getting user private channels from database = ', response.data);
			dispatch(updateUserPrivateChannels(response.data));

	  } catch (error) {
			console.log('error while getting user private channels from database', error);
	  }
	};
}

// fetch all the public chan for which the user is a member or a creator
export function fetchUserPublicChannels() {
	return async (dispatch: any, getState: any) => {
		const requestBody = {
			login: getState().persistedReducer.auth.nickname,
	  	};
	  try {
			const response = await api.post(
				"http://localhost:4001/channel/fetchUserPublicChannels",
				requestBody
			);
			// console.log('getting user public channels from database = ', response.data);
			dispatch(updateUserPublicChannels(response.data));

	  } catch (error) {
			console.log('error while getting user public channels from database', error);
	  }
	};
}

// fetch all the private conv for which the user is a member or a creator
export function fetchUserPrivateConvs() {
	return async (dispatch: any, getState: any) => {
		const requestBody = {
			login: getState().persistedReducer.auth.nickname,
	  	};
	  try {
			const response = await api.post(
				"http://localhost:4001/channel/fetchUserPrivateConvs",
				requestBody
			);
			// console.log('getting user private convs from database = ', response.data);
			dispatch(updateUserPrivateConvs(response.data));

	  } catch (error) {
			console.log('error while getting user private convs from database', error);
	  }
	};
}

// fetch all the private chan for which the user is a member or a creator
export function fetchPrivateChannels() {
	return async (dispatch: any, getState: any) => {
	  try {
			const response = await api.post(
				"http://localhost:4001/channel/fetchPrivateChannels"
			);
			// console.log('getting private channels from database = ', response.data);
			dispatch(updatePrivateChannels(response.data));

	  } catch (error) {
			console.log('error while getting private channels from database', error);
	  }
	};
}

// fetch all the public chan for which the user is a member or a creator
export function fetchPublicChannels() {
	return async (dispatch: any, getState: any) => {
	  try {
			const response = await api.post(
				"http://localhost:4001/channel/fetchPublicChannels"
			);
			// console.log('getting public channels from database = ', response.data);
			dispatch(updatePublicChannels(response.data));

	  } catch (error) {
			console.log('error while getting public channels from database', error);
	  }
	};
}

// fetch all the private conv for which the user is a member or a creator
export function fetchPrivateConvs() {
	return async (dispatch: any, getState: any) => {
	  try {
			const response = await api.post(
				"http://localhost:4001/channel/fetchPrivateConvs"
			);
			// console.log('getting private convs from database = ', response.data);
			dispatch(updatePrivateConvs(response.data));

	  } catch (error) {
			console.log('error while getting private convs from database', error);
	  }
	};
}
export const {
	updateUserChannels, 
	updateCreatedChannels, 
	updateMemberedChannels, 
	updateAllChannels, 
	updateDisplayedChannel,
	updateUserPrivateChannels,
	updateUserPublicChannels,
	updateUserPrivateConvs,
	updatePrivateChannels,
	updatePublicChannels,
	updatePrivateConvs,
	resetChannelStore,
} = channelsSlice.actions;

export default channelsSlice.reducer

export const selectUserChannels = (state: RootState) => state.persistedReducer.channels.userChannels
export const selectCreatedChannels = (state: RootState) => state.persistedReducer.channels.createdChannels
export const selectMemberedChannels = (state: RootState) => state.persistedReducer.channels.memberedChannels
export const selectAllChannels = (state: RootState) => state.persistedReducer.channels.allChannels
export const selectDisplayedChannel = (state: RootState) => state.persistedReducer.channels.displayedChannel
export const selectUserPrivateChannels = (state : RootState) => state.persistedReducer.channels.userPrivateChannels
export const selectUserPublicChannels = (state : RootState) => state.persistedReducer.channels.userPublicChannels
export const selectUserPrivateConvs = (state : RootState) => state.persistedReducer.channels.userPrivateConvs
export const selectPrivateChannels= (state : RootState) => state.persistedReducer.channels.privateChannels
export const selectPublicChannels = (state : RootState) => state.persistedReducer.channels.publicChannels
export const selectPrivateConvs = (state : RootState) => state.persistedReducer.channels.privateConvs