import { createSlice } from "@reduxjs/toolkit";

export interface ChannelTypeState {
	type: string;
	protected_by_password: boolean;
	password: string
  }
  
const initialState: ChannelTypeState = {
	type: '',
	protected_by_password: false,
	password: '',
};

// this an object with 2 attributes : 
// type,
// protected_by_password
// it represents the type of a channel
export const channelType = createSlice({
	name: "channelType",
	initialState,
	reducers: {
		addChannelType: (state, action) => {
			const newType = action.payload;
			state.type = newType;
			console.log("new type is : " + state.type);
		},
		isProtectedByPassword: (state, action) => {
			const pwd = action.payload;
			state.protected_by_password = pwd;
			console.log("is protected by password? " + state.protected_by_password);
		},
		addPassword: (state, action) => {
			const pwd = action.payload;
			state.password = pwd;
			console.log("password is " + state.password);
		}
	}
})

export const { addChannelType, isProtectedByPassword, addPassword } = channelType.actions

export default channelType.reducer