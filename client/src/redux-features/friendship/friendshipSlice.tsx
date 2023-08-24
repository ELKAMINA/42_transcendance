import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import  api  from '../../utils/Axios-config/Axios';
import { RootState } from '../../app/store';
import { setAvatar } from "../auth/authSlice";
import { UserModelProtected } from "../../types/users/userType";


export interface friendshipState {
    friendshipNamespace: string,
    suggestions: object [], // all users existing in the server except the user itself and the one's from which a response to a friend request is pending
    friends: object [], // all friends that accepted invitation
    friendRequests: object [], // people asking me to join 
    blockedFriends: object [],
	allUsers: [],
    selectedItems: string,
    user: Record<string, any>,
    specificFriend: UserModelProtected | undefined, 
    error: number,
    isMyFriend: {
        isMyfriend: boolean,
        myBlockedFriend: boolean,
        thoseWhoBlockedMe: boolean,
    }
}

const initialState: friendshipState = {
    friendshipNamespace: 'friendship',
    suggestions: [],
    friends: [],
    friendRequests: [],
    blockedFriends: [],
    selectedItems: '',
    user: {},
	allUsers: [],
    specificFriend: undefined, 
    error: 0,
    isMyFriend:
    {
        isMyfriend: false,
        myBlockedFriend: false,
        thoseWhoBlockedMe: false,
    }
    // socket: {} as unknown as Socket ,
}
// // Create slice makes us create action objects/types and creators (see actions as event handler and reducer as event listener)
export const friendshipSlice = createSlice({
    name: 'friendship',
    initialState,
    reducers: { // function that has for first param the actual state, and the 2nd param, the action that we want to apply to this state. Hence, the reducer will reduce this 2 params in one final state
        updateAllSuggestions: (state, action: PayloadAction<[{}]>) => {
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
        getActualUser: (state, action) => {
            state.user = action.payload;
        },
		getAllUsersInDb:(state, action) => {
            state.allUsers = action.payload;
        }, 
        setFriendshipError: (state, action: PayloadAction<number>) => {
            state.error = action.payload;
        },
        getUserToStalk: (state, action: PayloadAction<UserModelProtected | undefined>) => {
            state.specificFriend = action.payload;
        },
        getIsMyFriend: (state, action: PayloadAction<{
            isMyfriend: boolean,
            myBlockedFriend: boolean,
            thoseWhoBlockedMe: boolean}>) => {
            state.isMyFriend = action.payload;
        },
        resetFriendshipStore : (state) => {
            return initialState;
        },
    },
})

// // action need the name of the task/thing, i want to apply to the state and the data to do that (which is the payload)
export const { updateAllSuggestions, updateAllRequests, updateAllFriends, updateBlockedFriends, setSelectedItem, getActualUser, getAllUsersInDb, resetFriendshipStore, setFriendshipError, getUserToStalk, getIsMyFriend} = friendshipSlice.actions


export const selectSuggestions = (state: RootState) => state.persistedReducer.friendship.suggestions
export const selectFriends = (state: RootState) => state.persistedReducer.friendship.friends
export const selectFrRequests = (state: RootState) => state.persistedReducer.friendship.friendRequests
export const selectBlockedFriends = (state: RootState) => state.persistedReducer.friendship.blockedFriends
export const selectItems = (state: RootState) => state.persistedReducer.friendship.selectedItems
export const selectActualUser = (state: RootState) => state.persistedReducer.friendship.user
export const selectSpecificFriend = (state: RootState) => state.persistedReducer.friendship.specificFriend
export const selectError = (state: RootState) => state.persistedReducer.friendship.error
export const selectIsMyFriend = (state: RootState) => state.persistedReducer.friendship.isMyFriend

export function FetchUsersDb() {
	return async (dispatch:any, getState: any) => {
        await api
        .get("http://localhost:4001/user/all")
        .then((res) => {
            let dt = (res.data).filter((dat: any) => (dat.login !== getState().persistedReducer.auth.nickname));
			dispatch(getAllUsersInDb(dt));
		})
		.catch((e) => {
			dispatch(setFriendshipError(1))
		})
	}
}


export function FetchAllFriendRequests() {
return async (dispatch:any, getState: any) => {
    await api
        .post("http://0.0.0.0:4001/friendship/receivedRequests", {nickname: getState().persistedReducer.auth.nickname})
        .then((res) => {
            dispatch(updateAllRequests(res.data))
        })
        .catch((e) => {dispatch(setFriendshipError(2))
        });
    }
}

export function FetchActualUser() {
    return async (dispatch:any, getState: any) => {
        await api
        .post("http://localhost:4001/user/me", {nickname: getState().persistedReducer.auth.nickname})
        .then((res) => {
            dispatch(getActualUser(res.data))
            // console.log('lavatarr ', (res.data).avatar)
            dispatch(setAvatar((res.data).avatar))
        })
        .catch((e) => {dispatch(setFriendshipError(3))
        });
    }
}

export function FetchSuggestions() {
    return async (dispatch:any, getState: any) => {
        // console.log('Hiho ')
        await api
        .post("http://0.0.0.0:4001/friendship/suggestions", {nickname: getState().persistedReducer.auth.nickname})
        .then((res) => {
            // console.log('JE RENTRE ICIIIIIIIIII')
            dispatch(updateAllSuggestions(res.data))
        })
        .catch((e) => {
            // console.log('lerreur ', e);
            dispatch(setFriendshipError(4))
            })
        }
    } 
    
    export function FetchAllFriends() {
        return async (dispatch:any, getState: any) => {
            await api
            .post("http://0.0.0.0:4001/friendship/allFriends", {nickname: getState().persistedReducer.auth.nickname})
            .then((res) => {
                dispatch(updateAllFriends(res.data))
            })
            .catch((e) => {dispatch(setFriendshipError(5))
            });
        }
    }

    export function FetchAllBlockedFriends() {
        return async (dispatch:any, getState: any) => {
            await api
            .post("http://0.0.0.0:4001/friendship/blockedFriends", {nickname: getState().persistedReducer.auth.nickname})
            .then((res) => {
                dispatch(updateBlockedFriends(res.data))
            })
            .catch((e) => {dispatch(setFriendshipError(5))
            });
        }
    }

    export function FetchAFriend(name: string) {
        return async (dispatch:any, getState: any) => {
            await api
            .get("http://0.0.0.0:4001/user/userprofile", {
                params: {
                    ProfileName: name,
            }})
            .then((res) => {
                dispatch(getUserToStalk(res.data))
            })
            .catch((e) => {dispatch(setFriendshipError(6))
            });
        }
    }

    export function FetchFriendshipInfo(curr: string, him: string) {
        return async (dispatch:any, getState: any) => {
            await api
            .post("http://localhost:4001/friendship/ismyfriend", {
                me: curr,
                him: him,
            })
            .then((res) => {
                dispatch(getIsMyFriend(res.data))
            })
            .catch((e) => {dispatch(setFriendshipError(6))
            });
        }
    }
            
export default friendshipSlice.reducer
