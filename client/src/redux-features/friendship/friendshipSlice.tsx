import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from '../../app/store';
import  api  from '../../utils/Axios-config/Axios';

export interface friendshipState {
    suggestions: object [], // all users existing in the server except the user itself and the one's from which a response to a friend request is pending
    friends: object [], // all friends that accepted invitation
    friendRequests: object [], // people asking me to join 
    socket: object,
}

const initialState: friendshipState = {
    suggestions: [{}],
    friends: [{}],
    friendRequests: [{}],
    socket: {},

}
// // Create slice makes us create action objects/types and creators (see actions as event handler and reducer as event listener)
export const friendshipSlice = createSlice({
    name: 'friendship',
    initialState,
    reducers: { // function that has for first param the actual state, and the 2nd param, the action that we want to apply to this state. Hence, the reducer will reduce this 2 params in one final state
        updateAllUsers: (state, action: PayloadAction<[{}]>) => {
            state.suggestions = action.payload;
        },
        getSocket: (state, action: PayloadAction<{}>) => {
            state.socket = action.payload;
        } 
    },
})

// // action need the name of the task/thing, i want to apply to the state and the data to do that (which is the payload)

export const { updateAllUsers, getSocket } = friendshipSlice.actions
export const selectSuggestions = (state: RootState) => state.persistedReducer.friendship.suggestions
export const selectSocket = (state: RootState) => state.persistedReducer.friendship.socket
export const selectFriends = (state: RootState) => state.persistedReducer.friendship.friends
export const selectFrRequests = (state: RootState) => state.persistedReducer.friendship.friendRequests

export function FetchAllUsers() {
    return async (dispatch:any, getState: any) => {
        await api
        .get("http://0.0.0.0:4001/user/all")
        .then((res) => {
			// console.log("res = ", res);
            let dt;
            dt = (res.data).filter((dat: any) => dat.login !== getState().persistedReducer.auth.nickname)
            dispatch(updateAllUsers(dt))})
        .catch((e) => {});
  }
}
export default friendshipSlice.reducer

// // dispatch is for communicating with redux and tell him to trigger an action so when we write dispatch(setConnected(true) => we tell redux to call the reducer socket/setConnected with the action.payload = true which changes the state "isConnected to TRUE")


