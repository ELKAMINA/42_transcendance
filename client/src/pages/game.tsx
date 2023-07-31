import { io } from "socket.io-client";
import "./chat.css";
import "./game.css";

export const socket = io("http://localhost:4010", {
    withCredentials: true,
    transports: ["websocket"],
    upgrade: false,
    autoConnect: false,
});

enum GameStates {
	SETTINGS,
	MATCHMAKING,
	GAMEON,
	ENDGAME,
}

function Game () {

}

export default Game;