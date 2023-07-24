import clsx from "clsx";
import { store } from "../app/store";
import { io } from "socket.io-client";
import { Provider } from "react-redux";
import Grid from "@mui/material/Grid"; // Grid version 1
import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import "./chat.css";
import "./game.css";
import Navbar from "../components/NavBar";
import { Matchmaking } from "../components/MatchMaking";
import { transformData } from "./userProfile";
import { FetchUserByName } from "../utils/global/global";
import {
    updateOpponent,
    selectOpponent,
} from "../redux-features/game/gameSlice";
import { selectCurrentUser } from "../redux-features/auth/authSlice";
import { useAppSelector, useAppDispatch } from "../utils/redux-hooks";
import {
    FetchActualUser,
    getActualUser,
    selectActualUser,
} from "../redux-features/friendship/friendshipSlice";
import { useNavigate } from "react-router-dom";
import Player from "../classes/Player";
import Ball from "../classes/Ball";
import { gameInfo } from "../data/gameInfo";
import { ConstructionOutlined } from "@mui/icons-material";
import { Console } from "console";
export const socket = io("http://localhost:4010", {
    withCredentials: true,
    transports: ["websocket"],
    upgrade: false,
    autoConnect: false,
});

const halfGridStyle = {
    height: "100vh",
    background: "rgba(255, 255, 255, 0.5)",
};

const waitingGridStyle = {
    height: "100vh",
    backgroundColor: "#AFDBF5",
    color: "#005A9C",
};

function Game() {
    const currentRoute = window.location.pathname;
    const dispatch = useAppDispatch();
    const [startingGame, setStarting] = useState(false);
    const nickName = useAppSelector(selectCurrentUser);
    const user = useAppSelector(selectActualUser);
    const [gInfo, setGameInfo] = useState<gameInfo>({
        opponent: "",
        allRoomInfo: {
            id: "",
            createdDate: 0,
            totalSet: 0,
            totalPoint: 0,
            mapName: "",
            power: false,
            isFull: false,
            players: [],
            scorePlayers: [],
            playerOneId: "",
            playerTwoId: "",
        },
    });
    const navigate = useNavigate();

    // Function to clear complete cache data
    const clearCacheData = () => {
        caches.keys().then((names) => {
            names.forEach((name) => {
                caches.delete(name);
            });
        });
        console.log("Complete Cache Cleared");
        window.location.reload();
    };

    useEffect(() => {
        if (user.status !== "Playing") {
            socket.connect(); // Will use 'handleConnection' from nestjs/game
            socket.on("connect", () => {
                console.log("I'm connected, id is = ", socket.id);
                socket.emit("changeStatus", nickName);
            });
            socket.on("statusChanged", () => {
                dispatch(FetchActualUser());
                socket.emit("joinRoom", nickName);
            });
            // socket.on("waitingForOpponent", () => {
            // 	setStarting(false)
            // })
            socket.on("roomJoined", (newRoom) => {
                console.log("new room id", newRoom);
            });
            // console.log("jarrive jusque la ");

            socket.on("gameBegin", (roomInfo) => {
                dispatch(updateOpponent(roomInfo.opponent));
                setGameInfo((prevState) => ({
                    ...prevState,
                    opponent: roomInfo.opponent,
                    allRoomInfo: roomInfo.allRoomInfo,
                }));
                setTimeout(() => {
                    setStarting(true);
                    socket.on("forceDisconnection", () => {
                        navigate("/welcome");
                    });
                    // navigate('/pong', { state: {roomInfo}})
                }, 1000);
            });
            socket.on("forceDisconnection", () => {
                navigate("/welcome");
            });
        } else {
            console.log("I tried to cheat and took a shorcut to a game");
            navigate("/welcome");
        }
        return () => {
            // clearCacheData();
            dispatch(updateOpponent(""));
            if (socket) {
                console.log("I'm getting disconnected, id is = ", socket.id);
                socket.disconnect();
            }
        };
    }, []);

    const opp = useAppSelector(selectOpponent);
    return (
        <>
            <Navbar currentRoute={currentRoute} />
            {startingGame === false && (
                <Matchmaking infos={gInfo} nickname={nickName} />
            )}
            {startingGame === true && <Pong infos={gInfo} />}
        </>
    );
}

type BallType = {
    x: number;
    y: number;
    dx: number;
    dy: number;
};

interface PongProps {
    infos: gameInfo;
}

const Pong: React.FC<PongProps> = ({ infos }) => {
    const currentRoute = window.location.pathname;
    const dispatch = useAppDispatch();
    const nickName = useAppSelector(selectCurrentUser);
    const user = useAppSelector(selectActualUser);
    const location = useLocation();

    const roomInfo = location.state;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvas = useRef<CanvasRenderingContext2D | null>(null);
    const [canvasWidth, canvasHeight] = [800, 600];

    const player1 = useRef<Player>(
        new Player(
            [infos.allRoomInfo.playerOneId, infos.allRoomInfo.players[0]],
            [0, 0],
            10
        )
    );
    const player2 = useRef<Player>(
        new Player(
            [infos.allRoomInfo.playerTwoId, infos.allRoomInfo.players[1]],
            [0, 0],
            10
        )
    );

    const ball = useRef<Ball>(new Ball([0, 0], 5));

    player1.current.setPaddlePosition([
        10,
        (3 * canvasHeight) / 6 - player1.current.getPaddleDimension()[1] / 2,
    ]);
    player2.current.setPaddlePosition([
        canvasWidth - 10 - player2.current.getPaddleDimension()[0],
        (3 * canvasHeight) / 6 - player2.current.getPaddleDimension()[1] / 2,
    ]);
    ball.current.setPosition([canvasWidth / 2, canvasHeight / 2]);
    // console.log("les infos ", infos)
    // const player1 = useRef<Player>(new Player());
    // console.log(" toute la room ", props)
    /*Why useRef : unlike state updates, changes to a ref's .current property do not trigger a re-render of the component. This makes it useful for values that need to persist across renders but changes in these values should not cause an update to the component's output*/
    // const [paddleY, setPaddleY] = useState<number>(200);
    // const [ball, setBall] = useState<BallType>({ x: 10, y: 10, dx: 2, dy: 2 });

    const getPlayerId = (socketId: string) => {
        if (socketId === infos.allRoomInfo.playerOneId) {
            return player1.current;
        } else {
            return player2.current;
        }
    };

    /* Drawing functions  */
    // PLAYER PADDLE
    const drawRect = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        color: string
    ) => {
        // console.log("Call of drawRect", x, y, w, h, color);
        ctx.clearRect(x, y, w, h);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    };

    // BALL
    const drawCircle = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        r: number,
        color: string
    ) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false); // x = X position for the ball, y = Y position for the ball, r = radius, 0= start angle &&  Match.PI*2 = End Angle (correspond à 360 degres, false = to say that we want the ball to be drawn in the clockwise direction )
        ctx.closePath();
        ctx.fill();
    };

    // SCORE
    const drawText = (
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        color: string
    ) => {
        ctx.fillStyle = color;
        ctx.font = "75px fantasy";
        ctx.fillText(text, x, y);
    };

    let intervalId: any;

    // NET
    const drawNet = (
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        color: string
    ) => {
        ctx.fillStyle = color;
        ctx.font = "75px fantasy";
        ctx.fillText(text, x, y);
    };

    const keyPressed = (e: any) => {
        console.log(`Key ${e.key} was pressed`);
        const player = getPlayerId(socket.id);

        let direction = 1;
        if (e.key === "w") {
            direction = -direction;
        }
        let newPosY =
            player.getPaddlePosition()[1] + player.getPaddleSpeed() * direction;
        if (newPosY <= 0) {
            newPosY = 0;
        } else if (newPosY >= canvasHeight - player.getPaddleDimension()[1]) {
            newPosY = canvasHeight - player.getPaddleDimension()[1];
        }
        if (e.key === "w" || e.key === "s") {
            socket.emit("requestMovePaddle", newPosY);
        }
    };

    const updateBall = () => {
        const [ballX, ballY] = ball.current.getPosition();
        let [velX, velY] = ball.current.getVelocity();
        ball.current.setPosition([ballX + velX, ballY + velY]);
        if (
            ball.current.getPositionY() - ball.current.getRadius() <= 0 ||
            ball.current.getPositionY() + ball.current.getRadius() >=
                canvasHeight
        ) {
            ball.current.setVelocityY(-ball.current.getVelocityY());
        }
        if (socket.id === infos.allRoomInfo.playerOneId) {
            socket.emit("requestMoveBall", ball.current.getVelocity());
        }
        socket.on("requestMoveBall", (value) => {
            ball.current.setVelocity(value);
        });
    };

    const update = () => {
        socket.on("updateMovePaddle", (data) => {
            console.log(`Player ${data.player} must be updated`);
            const player = getPlayerId(socket.id);
            player.setPaddlePosition([
                player.getPaddlePosition()[0],
                data.value,
            ]);
        });
        updateBall();
    };

    const render = (cs: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        console.log(` width is ${cs.width} and the height is : ${cs.height}`);
        // CLEAR THE WHOLE CANVAS
        ctx.clearRect(0, 0, cs.width, cs.height);

        // DRAW THE BOARD IN BLACK COLOR
        drawRect(ctx, 0, 0, cs.width, cs.height, "#000000");

        // PLAYER 1 PADDLE
        console.log(
            `Player 1 has x: ${player1.current
                .getPaddlePosition()
                .at(0)} and y: ${player1.current.getPaddlePosition().at(1)}`
        );
        const [p1X, p1Y] = player1.current.getPaddlePosition();
        const [p1W, p1H] = player1.current.getPaddleDimension();

        // PLAYER 2 PADDLE
        console.log(
            `Player 2 has x: ${player2.current
                .getPaddlePosition()
                .at(0)} and y: ${player2.current.getPaddlePosition().at(1)}`
        );
        const [p2X, p2Y] = player2.current.getPaddlePosition();
        const [p2W, p2H] = player2.current.getPaddleDimension();

        // BALL
        const [bX, bY] = ball.current.getPosition();
        console.log("Ball", bX, bY);

        // DRAW OBJECT
        drawRect(ctx, p1X, p1Y, p1W, p1H, player1.current.getPaddleColor());
        drawRect(ctx, p2X, p2Y, p2W, p2H, player2.current.getPaddleColor());
        drawCircle(
            ctx,
            bX,
            bY,
            ball.current.getRadius(),
            ball.current.getColor()
        );
    };

    useEffect(() => {
        socket.connect(); // Will use 'handleConnection' from nestjs/game
        socket.on("connect", () => {});
        const cs = canvasRef.current;
        if (!cs) {
            return;
        }
        canvas.current = cs.getContext("2d");
        if (!canvas.current) {
            return;
        }
        const ctx = canvas.current;
        const theGame = () => {
            update();
            render(cs, ctx);
        };
        cs.addEventListener("keydown", keyPressed);
        cs.focus();
        intervalId = setInterval(theGame, 1000 / 60);
        return () => {};
    }, []);

    useEffect(() => {
        return () => {
            if (socket) {
                clearInterval(intervalId);
                socket.disconnect();
                dispatch(updateOpponent(""));
            }
        };
    }, []);

    return (
        <>
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        margin: "70px",
                    }}
                >
                    <canvas
                        className="canvas"
                        ref={canvasRef}
                        width={canvasWidth}
                        height={canvasHeight}
                        tabIndex={0}
                    />
                </Box>
            </Box>
            {/* onMouseMove={movePaddle} */}
        </>
    );
};

export default Game;
