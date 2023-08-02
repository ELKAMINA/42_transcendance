import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./chat.css";
import "./game.css";
import { useAppDispatch, useAppSelector } from "../utils/redux-hooks";
import {
    selectonGamePage,
    updateOnGamePage,
} from "../redux-features/game/gameSlice";

import HomePage from "./home";
import Settings from "../components/Game/Settings";
import { Matchmaking } from "../components/Game/MatchMaking";
import Pong from "../components/Game/Pong";
import EndGame from "../components/Game/EndGame";
import { gameInfo } from "../data/gameInfo";
import { selectCurrentUser } from "../redux-features/auth/authSlice";
import { roomInfo } from "../data/gameInfo";

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
    HOMEPAGE,
}

function Game() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const onGamePage = useAppSelector(selectonGamePage);
    const user = useAppSelector(selectCurrentUser);
    const [gameStatus, setGameStatus] = useState(GameStates.GAMEON);
    const [socketId, setSocketId] = useState("");

    const playButtonInfo = location.state.data;
    console.log("playButtonInfo:", playButtonInfo);

    const [gameSettings, setGameSettings] = useState<gameInfo>({
        id: "",
        createdDate: new Date(),
        totalSet: 0,
        mapName: "",
        power: false,
        isFull: false,
        players: [],
        scorePlayers: [],
        playerOneId: "",
        playerTwoId: "",
        gameStatus: GameStates.SETTINGS,
        totalPoint: 2,
        boardColor: "#ffffff",
        ballColor: "#000000",
        paddleColor: "#000000",
        netColor: "#000000",
    });

    const renderGameComponent = () => {
        switch (gameStatus) {
            case GameStates.SETTINGS:
                return <Settings />;
            case GameStates.MATCHMAKING:
                return <Matchmaking room={gameSettings} />;
            case GameStates.GAMEON:
                return <Pong />;
            case GameStates.ENDGAME:
                return <EndGame />;
            default:
                return <HomePage />;
        }
    };

    socket.off("updateComponent").on("updateComponent", (StateAndRoom: any) => {
        console.log(
            " 4 - Normalement je rentre la avec state = Settings(0) et Room = R ",
            StateAndRoom
        );
        if (StateAndRoom.room) {
            console.log("i got here ");
            setGameSettings(StateAndRoom.room);
        }
        setGameStatus(StateAndRoom.status);

        if (StateAndRoom.status === GameStates.HOMEPAGE) {
            dispatch(updateOnGamePage(0));
            navigate("/welcome");
        }
    });

    socket
        .off("updateGameSettings")
        .on("updateGameSettings", (StateAndRoom: any) => {
            if (StateAndRoom.room) {
                console.log(" - Normalement uen room créée ", StateAndRoom);
                setGameSettings(StateAndRoom.room);
            }
            setGameStatus(StateAndRoom.status);
        });
    useEffect(() => {}, [gameStatus]);

    useEffect(() => {
        socket.connect();
        socket.off("connect").on("connect", () => {
            console.log(socket.id);
            // FIRST CONNECTION OF THE USER
            if (onGamePage === 0) {
                console.log("[Game] State", 0);
                dispatch(updateOnGamePage(1));
                // ADD THE USER SOCKET TO THE POOL SOCKET
                socket.emit("initPlayground", playButtonInfo);
            } else if (onGamePage === 1) {
                // REFRESH OR RECONNECTION OF THE USER
                console.warn("[Game] State", 1);
                dispatch(updateOnGamePage(0));
                navigate("/welcome");
            } else {
                console.error("[Game] State: unknown");
            }
        });

        return () => {
            console.log("[Game] useEffect - return of the useEffect");
            dispatch(updateOnGamePage(0));
            socket.disconnect();
            console.log("[Game] useEffect - Request a disconnection");
        };
    }, []);

    console.log(`[Game] onGamePage: ${onGamePage}`);
    return <div>{renderGameComponent()}</div>;
}

export default Game;
