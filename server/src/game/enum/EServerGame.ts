// REPRESENT THE PLAYER BUTTON TYPE FROM HOME PAGE OR CHANNEL
export enum EServerPlayType {
  RANDOM,
  ONETOONE,
}

// OLD NAME GameStates
// REPRESENT THE LAYER OF THE GAME COMPONENT
export enum EGameServerStates {
  SETTINGS,
  MATCHMAKING,
  VERSUS,
  GAMEON, //Pong Component
  ENDGAME,
  HOMEPAGE,
}

// OLD NAME gameStatus
// REPRESENT THE STATE OF THE ROOM
export enum ERoomStates {
  WaitingOpponent,
  Busy,
  GameOn,
  Ended,
  Closed,
}
