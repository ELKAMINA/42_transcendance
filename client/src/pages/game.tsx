import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./chat.css";
import "./game.css";
import Navbar from "../components/NavBar";
import { useAppDispatch, useAppSelector } from "../utils/redux-hooks";
import {
    selectonGamePage,
    updateOnGamePage,
} from "../redux-features/game/gameSlice";

import HomePage from "./home";
import Settings from "../components/Game/Settings";
import { Matchmaking } from "../components/Game/MatchMaking";
import Pong from "../components/Game/Pong";

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

function Game() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const onGamePage = useAppSelector(selectonGamePage);
    const [gameStatus, setGameStatus] = useState(GameStates.SETTINGS);
    const currentRoute = window.location.pathname;
    const [socketId, setSocketId] = useState("");

    const renderGameComponent = () => {
        switch (gameStatus) {
            case GameStates.SETTINGS:
                return <Settings />;
            case GameStates.MATCHMAKING:
                return <Matchmaking />;
            case GameStates.GAMEON:
                return <Pong />;
            // case GameStates.ENDGAME:
            //     return <EndGame />;
            default:
                return <HomePage />;
        }
    };

    useEffect(() => {
        socket.connect();
        socket.off("connect").on("connect", () => {
            console.log(socket.id);
            if (onGamePage === 0) {
                console.log("[Game] State", 0);
                dispatch(updateOnGamePage(1));
            } else if (onGamePage === 1) {
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
    return (
        <div>
            <Navbar currentRoute={currentRoute} />
            {renderGameComponent()}
        </div>
    );
}

export default Game;
