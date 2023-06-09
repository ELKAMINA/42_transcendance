import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from '../../app/store';
import  api  from '../../utils/Axios-config/Axios';
import { UserPrisma } from "../../data/userList";

export interface GameState {
    totalMatchesPlayed: number,
    totalMatchesLost: number,
    totalMatchesWon: number,
    totalPlayers: number,
    level: number,
    rank: number,
    MatchesLost: [],
    allMatches: [],
    MatchesWon: [],
    user: UserPrisma | null,
}

const initialState: GameState = {
    totalPlayers: 0,
    totalMatchesPlayed: 0,
    totalMatchesLost: 0,
    totalMatchesWon: 0,
    level: 0,
    rank: 0,
    MatchesLost: [],
    allMatches: [],
    MatchesWon: [],
    user: null,
}
// // Create slice makes us create action objects/types and creators (see actions as event handler and reducer as event listener)
export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: { // function that has for first param the actual state, and the 2nd param, the action that we want to apply to this state. Hence, the reducer will reduce this 2 params in one final state
        updateTotalMatchesPlayed: (state, action: PayloadAction<number>) => {
            state.totalMatchesPlayed = action.payload;
        }, 
        updateTotalMatchesLost: (state, action: PayloadAction<number>) => {
            state.totalMatchesLost = action.payload;
        },
        updateTotalMatchesWon: (state, action: PayloadAction<number>) => {
            state.totalMatchesWon = action.payload;
        },
        // updateTotalPoints: (state, action: PayloadAction<number>) => {
        //     state.totalPoints = action.payload;
        // },
        updateTotalPlayers: (state, action: PayloadAction<number>) => {
            state.totalPlayers = action.payload;
        },
        updateLevel: (state, action: PayloadAction<number>) => {
            state.level = action.payload;
        },
        updateRank: (state, action: PayloadAction<number>) => {
            state.rank = action.payload;
        },
        updateAllMatches: (state, action: PayloadAction<[]>) => {
            state.allMatches = action.payload;
        },
        updateMatchesLost: (state, action: PayloadAction<[]>) => {
            state.MatchesLost = action.payload;
        },
        updateMatchesWon: (state, action: PayloadAction<[]>) => {
            state.MatchesWon = action.payload;
        },
        getUserInfos: (state, action: PayloadAction<UserPrisma>) => {
            state.user = action.payload;
        },
    },
})

// // action need the name of the task/thing, i want to apply to the state and the data to do that (which is the payload)
export const { updateTotalMatchesPlayed, updateTotalMatchesLost,updateTotalMatchesWon,updateTotalPlayers, updateLevel,updateRank,updateAllMatches,updateMatchesLost,updateMatchesWon } = gameSlice.actions
export const selectTotalMatchesPlayed: any = (state: RootState) => state.persistedReducer.game.totalMatchesPlayed
export const selectTotalMatchesLost = (state: RootState) => state.persistedReducer.game.totalMatchesLost
export const selectTotalMatchesWon = (state: RootState) => state.persistedReducer.game.totalMatchesWon
// export const selectTotalPoints = (state: RootState) => state.persistedReducer.game.totalPoints
export const selectTotalPlayers = (state: RootState) => state.persistedReducer.game.totalPlayers
export const selectRank = (state: RootState) => state.persistedReducer.game.rank
export const selectLevel = (state: RootState) => state.persistedReducer.game.level
export const selectAllMatches = (state: RootState) => state.persistedReducer.game.allMatches
export const selectMatchesWon = (state: RootState) => state.persistedReducer.game.MatchesWon
export const selectMatchesLost = (state: RootState) => state.persistedReducer.game.MatchesLost

export function FetchTotalPlayers() {
    return async (dispatch:any, getState: any) => {
        await api
        .get("http://localhost:4001/global/totalPlayers")
        .then((res) => {
            console.log('Total Players ', res.data);
            dispatch(updateTotalPlayers(res.data))
        }
        )
        .catch((e) => {console.log("error ", e)});
  }
}

// export function FetchPlayerRank() {
//     return async (dispatch:any, getState: any) => {
//         await api
//         .post("http://localhost:4001/game/playerRank")
//         .then((res) => {
//             console.log('Total Players ', res.data);
//             dispatch(updateTotalPlayers(res.data))
//         }
//         )
//         .catch((e) => {console.log("error ", e)});
//   }
// }


export default gameSlice.reducer

// // dispatch is for communicating with redux and tell him to trigger an action so when we write dispatch(setConnected(true) => we tell redux to call the reducer socket/setConnected with the action.payload = true which changes the state "isConnected to TRUE")


