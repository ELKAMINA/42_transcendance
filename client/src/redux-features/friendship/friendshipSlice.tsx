import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from '../../app/store';
import  api  from '../../utils/Axios-config/Axios';
// export const SOCKET = "SOCKET"

// export interface ISocketType {
//   type: typeof SOCKET,
//   payload: Socket
// }

export interface friendshipState {
    friendshipNamespace: string,
    suggestions: object [], // all users existing in the server except the user itself and the one's from which a response to a friend request is pending
    friends: object [], // all friends that accepted invitation
    friendRequests: object [], // people asking me to join 
    blockedFriends: object [],
    socketId: string,
}

const initialState: friendshipState = {
    friendshipNamespace: 'friendship',
    suggestions: [],
    friends: [],
    friendRequests: [],
    blockedFriends: [],
    socketId: '',
    // socket: {} as unknown as Socket ,
}
// // Create slice makes us create action objects/types and creators (see actions as event handler and reducer as event listener)
export const friendshipSlice = createSlice({
    name: 'friendship',
    initialState,
    reducers: { // function that has for first param the actual state, and the 2nd param, the action that we want to apply to this state. Hence, the reducer will reduce this 2 params in one final state
        updateAllUsers: (state, action: PayloadAction<[{}]>) => {
            state.suggestions = action.payload;
        },
        updateAllRequests: (state, action: PayloadAction<[{}]>) => {
            state.friendRequests = action.payload;
        },
        updateAllFriends: (state, action: PayloadAction<[{}]>) => {
            state.friends = action.payload;
        },
        updateBlockedFriends: (state, action: PayloadAction<[{}]>) => {
            state.blockedFriends = action.payload;
        },
        updateFriendshipNamespace: (state, action: PayloadAction<string>) => {
            state.friendshipNamespace = action.payload;
        },
        updateSocketId: (state = initialState, action: PayloadAction<string>) => {
            state.socketId = action.payload;
        }    
    },
})

// // action need the name of the task/thing, i want to apply to the state and the data to do that (which is the payload)
// && !friends.includes(dat) && !requests.includes(dat.receiverId)
export const { updateAllUsers, updateAllRequests, updateAllFriends, updateBlockedFriends, updateSocketId } = friendshipSlice.actions
export const selectSuggestions = (state: RootState) => state.persistedReducer.friendship.suggestions
export const selectFriends = (state: RootState) => state.persistedReducer.friendship.friends
export const selectFrRequests = (state: RootState) => state.persistedReducer.friendship.friendRequests
export const selectBlockedFriends = (state: RootState) => state.persistedReducer.friendship.blockedFriends
export const selectFriendshipNamespace = (state: RootState) => state.persistedReducer.friendship.friendshipNamespace
export const selectSocketId = (state: RootState) => state.persistedReducer.friendship.socketId

export function FetchAllUsers() {
    return async (dispatch:any, getState: any) => {
        const friends = getState().persistedReducer.friendship.friends;
        const requests = getState().persistedReducer.friendship.friendRequests;
        console.log("Les friends ", requests);
        // console.log("Les requests ", requests);
        await api
        .get("http://0.0.0.0:4001/user/all")
        .then((res) => {
            let dt = (res.data).filter((dat: any) => (dat.login !== getState().persistedReducer.auth.nickname));
            dispatch(updateAllUsers(dt))
        })
        .catch((e) => {console.log("error ", e)});
  } 
}

export function FetchAllFriendRequests() {
    return async (dispatch:any, getState: any) => {
        await api
        .post("http://0.0.0.0:4001/friendship/allRequests", {nickname: getState().persistedReducer.auth.nickname})
        .then((res) => {
            dispatch(updateAllRequests(res.data))})
        .catch((e) => {console.log("error ", e)});
  }
}

export function FetchAllFriends() {
    return async (dispatch:any, getState: any) => {
        await api
        .post("http://0.0.0.0:4001/friendship/allFriends", {nickname: getState().persistedReducer.auth.nickname})
        .then((res) => {
            dispatch(updateAllFriends(res.data))})
        .catch((e) => {console.log("error ", e)});
  }
}

export function FetchAllBlockedFriends() {
    return async (dispatch:any, getState: any) => {
        await api
        .post("http://0.0.0.0:4001/friendship/allFriends", {nickname: getState().persistedReducer.auth.nickname})
        .then((res) => {
            dispatch(updateAllFriends(res.data))})
        .catch((e) => {console.log("error ", e)});
  }
}

export default friendshipSlice.reducer

// // dispatch is for communicating with redux and tell him to trigger an action so when we write dispatch(setConnected(true) => we tell redux to call the reducer socket/setConnected with the action.payload = true which changes the state "isConnected to TRUE")


