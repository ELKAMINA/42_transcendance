import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import api from "../../utils/Axios-config/Axios";
import { UserLeaderBoard } from "../../types/users/userType";

export interface GameState {
    totalMatchesPlayed: number;
    totalMatchesLost: number;
    totalMatchesWon: number;
    totalPlayers: number;
    level: number;
    rank: number;
    MatchesLost: [];
    allMatches: [];
    MatchesWon: [];
    opponent: string;
    leaderboard: UserLeaderBoard[];
    onGamePage: number;
    // Rank: number;
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
    opponent: "",
    leaderboard: [],
    onGamePage: 0,
    // rank: 0,
};
// // Create slice makes us create action objects/types and creators (see actions as event handler and reducer as event listener)
export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        // function that has for first param the actual state, and the 2nd param, the action that we want to apply to this state. Hence, the reducer will reduce this 2 params in one final state
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
        updateOpponent: (state, action: PayloadAction<string>) => {
            state.opponent = action.payload;
        },
        updateLeaderBoard: (
            state,
            action: PayloadAction<UserLeaderBoard[]>
        ) => {
            state.leaderboard = action.payload;
        },
        updateOnGamePage: (state, action: PayloadAction<number>) => {
            state.onGamePage = action.payload;
        },
    },
});

// // action need the name of the task/thing, i want to apply to the state and the data to do that (which is the payload)
export const {
    updateTotalMatchesPlayed,
    updateTotalMatchesLost,
    updateTotalMatchesWon,
    updateTotalPlayers,
    updateLevel,
    updateRank,
    updateAllMatches,
    updateMatchesLost,
    updateMatchesWon,
    updateOpponent,
    updateLeaderBoard,
    updateOnGamePage,
} = gameSlice.actions;
export const selectTotalMatchesPlayed: any = (state: RootState) =>
    state.persistedReducer.game.totalMatchesPlayed;
export const selectTotalMatchesLost = (state: RootState) =>
    state.persistedReducer.game.totalMatchesLost;
export const selectTotalMatchesWon = (state: RootState) =>
    state.persistedReducer.game.totalMatchesWon;
// export const selectTotalPoints = (state: RootState) => state.persistedReducer.game.totalPoints
export const selectTotalPlayers = (state: RootState) =>
    state.persistedReducer.game.totalPlayers;
export const selectRank = (state: RootState) =>
    state.persistedReducer.game.rank;
export const selectLevel = (state: RootState) =>
    state.persistedReducer.game.level;
export const selectAllMatches = (state: RootState) =>
    state.persistedReducer.game.allMatches;
export const selectMatchesWon = (state: RootState) =>
    state.persistedReducer.game.MatchesWon;
export const selectMatchesLost = (state: RootState) =>
    state.persistedReducer.game.MatchesLost;
export const selectOpponent = (state: RootState) =>
    state.persistedReducer.game.opponent;
export const selectLeaderBoard = (state: RootState) =>
    state.persistedReducer.game.leaderboard;
export const selectonGamePage = (state: RootState) =>
    state.persistedReducer.game.onGamePage;

export function FetchTotalPlayers() {
    return async (dispatch: any, getState: any) => {
        await api
            .get("http://localhost:4001/global/totalPlayers")
            .then((res) => {
                // console.log('Total Players ', res.data);
                dispatch(updateTotalPlayers(res.data));
            })
            .catch((e) => {
                console.log("error ");
            });
    };
}

export function FetchLeaderBoard() {
    return async (dispatch: any, getState: any) => {
        await api
            .get("http://localhost:4001/game/leaderboard")
            .then((res) => {
                dispatch(updateLeaderBoard(res.data));
                // console.log(" response pur le leaderboard ", res.data);
            })
            .catch((e) => {
                console.error("Error in Leaderboard request");
            });
    };
}
export default gameSlice.reducer;
