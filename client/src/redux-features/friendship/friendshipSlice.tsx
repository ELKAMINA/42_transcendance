import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from '../../app/store';
import  api  from '../../utils/Axios-config/Axios';
import { transformData } from "../../pages/userProfile";


export interface friendshipState {
    friendshipNamespace: string,
    suggestions: object [], // all users existing in the server except the user itself and the one's from which a response to a friend request is pending
    friends: object [], // all friends that accepted invitation
    friendRequests: object [], // people asking me to join 
    blockedFriends: object [],
    selectedItems: string,
	user: [],
}

const initialState: friendshipState = {
    friendshipNamespace: 'friendship',
    suggestions: [],
    friends: [],
    friendRequests: [],
    blockedFriends: [],
    selectedItems: '',
	user: [],
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
        setSelectedItem: (state, action) => {
            state.selectedItems = action.payload;
        },
		getUserByname: (state, action) => {
            state.user = action.payload;
        }
    },
})

// // action need the name of the task/thing, i want to apply to the state and the data to do that (which is the payload)
export const { updateAllUsers, updateAllRequests, updateAllFriends, updateBlockedFriends, setSelectedItem, getUserByname } = friendshipSlice.actions
export const selectSuggestions = (state: RootState) => state.persistedReducer.friendship.suggestions
export const selectFriends = (state: RootState) => state.persistedReducer.friendship.friends
export const selectFrRequests = (state: RootState) => state.persistedReducer.friendship.friendRequests
export const selectBlockedFriends = (state: RootState) => state.persistedReducer.friendship.blockedFriends
export const selectItems = (state: RootState) => state.persistedReducer.friendship.selectedItems

export function FetchAllFriendRequests() {
    return async (dispatch:any, getState: any) => {
        await api
        .post("http://0.0.0.0:4001/friendship/receivedRequests", {nickname: getState().persistedReducer.auth.nickname})
        .then((res) => {
            // console.log('je rentre ici ', res.data);
            dispatch(updateAllRequests(res.data))})
        .catch((e) => {console.log("error ", e)});
  }
}

export function FetchAllUsers() {
    return async (dispatch:any, getState: any) => {
        await api
        .get("http://localhost:4001/user/all")
        .then((res) => {
            let dt = (res.data).filter((dat: any) => (dat.login !== getState().persistedReducer.auth.nickname));
            let arr = Object.values(dt);
            // console.log('arr ', arr);
            api
            .post("http://0.0.0.0:4001/friendship/receivedRequests", {nickname: getState().persistedReducer.auth.nickname})
            .then((res) => {
                const requests = Object.values(res.data);
                const updatedArray = arr.filter((obj1: any) =>
                    !requests.some((obj2: any) => obj2.senderId === obj1.login)
                  );
                // console.log(' last array ', updatedArray);
                api
                .post("http://0.0.0.0:4001/friendship/allFriends", {nickname: getState().persistedReducer.auth.nickname})
                .then((res) => {
                    const friends = Object.values(res.data);
                    // console.log('la response pr Firends ', res.data);
                    const withoutFriends: any = updatedArray.filter((obj1: any) =>
                    !friends.some((obj2: any) => obj2.login === obj1.login)

                  );
                  api
                  .post("http://0.0.0.0:4001/friendship/sentRequests", {nickname: getState().persistedReducer.auth.nickname})
                  .then((res) => {
                      const reqSent = Object.values(res.data);
                    //   console.log("Req sennnnt ", reqSent);
                      const withoutreqSent: any = withoutFriends.filter((obj1: any) =>
                      !reqSent.some((obj2: any) => obj2.receiverId === obj1.login)
  
                    );  
                dispatch(updateAllUsers(withoutreqSent));
                })
            })
        })
            .catch((e) => {console.log("error ", e)});
        })
        .catch((e) => {console.log("error ", e)})
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
			// console.log(' BLOCKED FRIENDS ', res.data )
            dispatch(updateBlockedFriends((res.data).values(res.data)))})
        .catch((e) => {console.log("error ", e)});
  }
}



// export function FetchUserByName(name: string ) {
//     return async (dispatch:any, getState: any) => {
//         await api
// 		.get('http://localhost:4001/user/userprofile', {
// 			params: {
// 				ProfileName: name,
// 			}
// 		})
// 		.then((res) => {
// 			const params = new URLSearchParams(res.data)
//             const userData = transformData(params)
// 			dispatch(getUserbyName(userData))
// 		})
// 		.catch((e) => {
// 			console.log('ERROR from request with params ', e)
// 		})
//   }
// }

export default friendshipSlice.reducer

// // dispatch is for communicating with redux and tell him to trigger an action so when we write dispatch(setConnected(true) => we tell redux to call the reducer socket/setConnected with the action.payload = true which changes the state "isConnected to TRUE")


