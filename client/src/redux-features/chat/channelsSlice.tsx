import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { channelList } from "../../data/channelList";
import { ChannelModel } from "../../types/chat/channelTypes";
import { RootState } from "../../app/store";
import api from "../../utils/Axios-config/Axios";
import { emptyChannel } from "../../data/emptyChannel";

export interface ChannelSlice {
	userChannels : ChannelModel[],
	displayedChannel : ChannelModel,
	publicChannels : ChannelModel[],
	gameDialog: boolean,
	isMember: boolean,
	isBanned: boolean,
	isPopupOpen: boolean,
	ownerUpdate: boolean,
	adminUpdate: boolean,
	kickedUpdate : boolean,
	isMuted: MutingInfo[],
	// createdChannels : ChannelModel[],
	// memberedChannels : ChannelModel[],
	// allChannels : ChannelModel[],
	// privateChannels : ChannelModel[],
	// privateConvs : ChannelModel[],
	// userPrivateChannels : ChannelModel[],
	// userPublicChannels : ChannelModel[],
	// userPrivateConvs : ChannelModel[],

}

const initialState : ChannelSlice = {
	userChannels: [],
	displayedChannel : emptyChannel,
	publicChannels : [],
	gameDialog: false,
	isMember: false,
	isBanned: false,
	adminUpdate: false,
	ownerUpdate: false,
	isPopupOpen: false,
	kickedUpdate : false,
	isMuted: [],
	// createdChannels : [],
	// memberedChannels : [],
	// allChannels: [],
	// privateChannels : [],
	// privateConvs : [],
	// userPrivateChannels : [],
	// userPublicChannels : [],
	// userPrivateConvs : [],
};

export type MutingInfo = {
	channelName: string;
	muted: boolean;
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
		  
		updateDisplayedChannel: (state, action: PayloadAction<ChannelModel>) => {
			return {
				...state,
				displayedChannel : action.payload
			}
		},

		updatePublicChannels: (state, action: PayloadAction<ChannelModel[]>) => {
			return {
				...state,
				publicChannels : action.payload
			}
		},

		setGameDialog: (state, action: PayloadAction<boolean>) => {
			return {
				...state,
				gameDialog : action.payload
			}
		},
		setIsMuted: (state, action: PayloadAction<MutingInfo>) => {
			// console.log('je rentre ici ou pas ?', action.payload)
			const channelIndex = state.isMuted.findIndex(el => el.channelName === action.payload.channelName);
			if (channelIndex !== -1) {
				// The channel's mute info is already present. Update it.
				// console.log("identification du chan ", state.isMuted[channelIndex])
				// console.log("Le payload  ", action.payload.muted)
				state.isMuted[channelIndex].muted = action.payload.muted;
			  } else {
				state.isMuted.push(action.payload)
			  }
		},
		setIsMember: (state, action: PayloadAction<boolean>) => {
			state.isMember = action.payload;
		},
		setIsBanned: (state, action: PayloadAction<boolean>) => {
			// console.log("[channelslice - bannedUpdate] action.payload = ", action.payload)
			state.isBanned = action.payload;
		},
		setOwnerUpdate: (state, action: PayloadAction<boolean>) => {
			state.ownerUpdate = action.payload;
		},
		setAdminUpdate: (state, action: PayloadAction<boolean>) => {
			// console.log("[channelslice - adminUpdate] action.payload = ", action.payload)
			state.adminUpdate = action.payload;
		},
		setKickedUpdate: (state, action: PayloadAction<boolean>) => {
			// console.log("[channelslice - kickedUpdate] action.payload = ", action.payload)
			state.kickedUpdate = action.payload;
		},
		setIsPopupOpen: (state, action: PayloadAction<boolean>) => {
			state.isPopupOpen = action.payload;
		},
		resetChannelStore : (state) => {
            return initialState;
        },
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

export function fetchDisplayedChannel(name : string) {
	// console.log("[fetchDisplayedChannel] fetching channel : ", name);
	return async (dispatch: any, getState: any) => {
		const requestBody = {
			name: name,
		}
		try {
			const response = await api.post("http://localhost:4001/channel/displayed", requestBody);
			if (response === undefined)
				dispatch(updateDisplayedChannel(emptyChannel));
			else {
				// console.log("[fetchDisplayedChannel] response = ", response);
				dispatch(updateDisplayedChannel(response.data));
			} 
	
		} catch (error) {
			console.log(`error while getting displayed channel ${requestBody.name} from database`, error);
		}
	};
}

// // fetch all the public channels in db
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

export const {
	updateUserChannels, 
	updateDisplayedChannel,
	updatePublicChannels,
	resetChannelStore,
	setGameDialog,
	setIsMuted,
	setIsMember,
	setIsBanned,
	setOwnerUpdate,
	setAdminUpdate,
	setKickedUpdate,
	setIsPopupOpen,
	// updateCreatedChannels, 
	// updateMemberedChannels, 
	// updateAllChannels, 
	// updateUserPrivateChannels,
	// updateUserPublicChannels,
	// updateUserPrivateConvs,
	// updatePrivateChannels,
	// updatePrivateConvs,
} = channelsSlice.actions;

export default channelsSlice.reducer

export const selectUserChannels = (state: RootState) => state.persistedReducer.channels.userChannels
export const selectDisplayedChannel = (state: RootState) => state.persistedReducer.channels.displayedChannel
export const selectPublicChannels = (state : RootState) => state.persistedReducer.channels.publicChannels
export const selectGameDialog = (state : RootState) => state.persistedReducer.channels.gameDialog
export const selectIsMuted = (state : RootState) => state.persistedReducer.channels.isMuted
export const selectIsMember = (state : RootState) => state.persistedReducer.channels.isMember
export const selectIsBanned = (state : RootState) => state.persistedReducer.channels.isBanned
export const selectIsPopupOpen = (state : RootState) => state.persistedReducer.channels.isPopupOpen
export const selectOwnerUpdate = (state : RootState) => state.persistedReducer.channels.ownerUpdate
export const selectAdminUpdate = (state : RootState) => state.persistedReducer.channels.adminUpdate
export const selectKickedUpdate = (state : RootState) => state.persistedReducer.channels.kickedUpdate
// export const selectCreatedChannels = (state: RootState) => state.persistedReducer.channels.createdChannels
// export const selectMemberedChannels = (state: RootState) => state.persistedReducer.channels.memberedChannels
// export const selectAllChannels = (state: RootState) => state.persistedReducer.channels.allChannels
// export const selectUserPrivateChannels = (state : RootState) => state.persistedReducer.channels.userPrivateChannels
// export const selectUserPublicChannels = (state : RootState) => state.persistedReducer.channels.userPublicChannels
// export const selectUserPrivateConvs = (state : RootState) => state.persistedReducer.channels.userPrivateConvs
// export const selectPrivateChannels= (state : RootState) => state.persistedReducer.channels.privateChannels
// export const selectPrivateConvs = (state : RootState) => state.persistedReducer.channels.privateConvs