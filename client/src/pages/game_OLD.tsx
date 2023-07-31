// import { io } from "socket.io-client";
// import { Box } from "@mui/material";
// import { useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";

// import "./chat.css";
// import "./game.css";
// import Navbar from "../components/NavBar";
// import { Matchmaking } from "../components/Game/MatchMaking";
// import {
//     updateOpponent,
//     selectOpponent,
// } from "../redux-features/game/gameSlice";
// import { selectCurrentUser } from "../redux-features/auth/authSlice";
// import { useAppSelector, useAppDispatch } from "../utils/redux-hooks";
// import {
//     FetchActualUser,
//     selectActualUser,
// } from "../redux-features/friendship/friendshipSlice";
// import { useNavigate } from "react-router-dom";
// import Player from "../classes/Player";
// import Ball from "../classes/Ball";
// import { gameInfo } from "../data/gameInfo";

// export const socket = io("http://localhost:4010", {
//     withCredentials: true,
//     transports: ["websocket"],
//     upgrade: false,
//     autoConnect: false,
// });

// const halfGridStyle = {
//     height: "100vh",
//     background: "rgba(255, 255, 255, 0.5)",
// };

// const waitingGridStyle = {
//     height: "100vh",
//     backgroundColor: "#AFDBF5",
//     color: "#005A9C",
// };

// function Game() {
//     const currentRoute = window.location.pathname;
//     const dispatch = useAppDispatch();
//     const [startingGame, setStarting] = useState(false);
//     const nickName = useAppSelector(selectCurrentUser);
//     const user = useAppSelector(selectActualUser);
//     const [gInfo, setGameInfo] = useState<gameInfo>({
//         opponent: "",
//         allRoomInfo: {
//             id: "",
//             createdDate: new Date(),
//             totalSet: 0,
//             totalPoint: 0,
//             mapName: "",
//             power: false,
//             isFull: false,
//             players: [],
//             scorePlayers: [],
//             playerOneId: "",
//             playerTwoId: "",
//         },
//     });
//     const navigate = useNavigate();

//     // Function to clear complete cache data
//     const clearCacheData = () => {
//         caches.keys().then((names) => {
//             names.forEach((name) => {
//                 caches.delete(name);
//             });
//         });
//         console.log("Complete Cache Cleared");
//         window.location.reload();
//     };

//     useEffect(() => {
//         if (user.status !== "Playing") {
//             socket.connect(); // Will use 'handleConnection' from nestjs/game
//             socket.on("connect", () => {
//                 console.log("I'm connected, id is = ", socket.id);
//                 socket.emit("changeStatus", nickName);
//             });
//             socket.on("statusChanged", () => {
//                 dispatch(FetchActualUser());
//                 socket.emit("joinRoom", nickName);
//             });
//             // socket.on("waitingForOpponent", () => {
//             // 	setStarting(false)
//             // })
//             socket.on("roomJoined", (newRoom) => {
//                 console.log("new room id", newRoom);
//             });
//             // console.log("jarrive jusque la ");

//             socket.on("gameBegin", (roomInfo) => {
//                 dispatch(updateOpponent(roomInfo.opponent));
//                 setGameInfo((prevState) => ({
//                     ...prevState,
//                     opponent: roomInfo.opponent,
//                     allRoomInfo: roomInfo.allRoomInfo,
//                 }));
//                 setTimeout(() => {
//                     setStarting(true);
//                     socket.on("forceDisconnection", () => {
//                         navigate("/welcome");
//                     });
//                     // navigate('/pong', { state: {roomInfo}})
//                 }, 1000);
//             });
//             socket.on("forceDisconnection", () => {
//                 navigate("/welcome");
//             });
//         } else {
//             console.log("I tried to cheat and took a shorcut to a game");
//             navigate("/welcome");
//         }
//         return () => {
//             // clearCacheData();
//             dispatch(updateOpponent(""));
//             if (socket) {
//                 console.log("I'm getting disconnected, id is = ", socket.id);
//                 socket.disconnect();
//             }
//         };
//     }, []);

//     const opp = useAppSelector(selectOpponent);
//     return (
//         <>
//             <Navbar currentRoute={currentRoute} />
//             {startingGame === false && (
//                 <Matchmaking infos={gInfo} nickname={nickName} />
//             )}
//             {startingGame === true && <Pong infos={gInfo} />}
//         </>
//     );
// }

// interface PongProps {
//     infos: gameInfo;
// }

// const Pong: React.FC<PongProps> = ({ infos }) => {
//     const currentRoute = window.location.pathname;
//     const dispatch = useAppDispatch();
//     const nickName = useAppSelector(selectCurrentUser);
//     const user = useAppSelector(selectActualUser);
//     const location = useLocation();

//     const roomInfo = location.state;
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);
//     const canvas = useRef<CanvasRenderingContext2D | null>(null);
//     const [canvasWidth, canvasHeight] = [800, 600];

//     const player1 = useRef<Player>(
//         new Player(
//             [infos.allRoomInfo.playerOneId, infos.allRoomInfo.players[0]],
//             [0, 0],
//             20
//         )
//     );
//     const player2 = useRef<Player>(
//         new Player(
//             [infos.allRoomInfo.playerTwoId, infos.allRoomInfo.players[1]],
//             [0, 0],
//             20
//         )
//     );

//     const ball = useRef<Ball>(new Ball([0, 0], 5));

//     player1.current.setPaddlePosition([
//         10,
//         (3 * canvasHeight) / 6 - player1.current.getPaddleDimension()[1] / 2,
//     ]);
//     player2.current.setPaddlePosition([
//         canvasWidth - 10 - player2.current.getPaddleDimension()[0],
//         (3 * canvasHeight) / 6 - player2.current.getPaddleDimension()[1] / 2,
//     ]);
//     ball.current.setPosition([canvasWidth / 2, canvasHeight / 2]);
//     // console.log("les infos ", infos)
//     // const player1 = useRef<Player>(new Player());
//     // console.log(" toute la room ", props)
//     /*Why useRef : unlike state updates, changes to a ref's .current property do not trigger a re-render of the component. This makes it useful for values that need to persist across renders but changes in these values should not cause an update to the component's output*/
//     // const [paddleY, setPaddleY] = useState<number>(200);

//     const getPlayerId = (socketId: string) => {
//         if (socketId === infos.allRoomInfo.playerOneId) {
//             return player1.current;
//         } else {
//             return player2.current;
//         }
//     };

//     /* Drawing functions  */
//     // PLAYER PADDLE
//     const drawRect = (
//         ctx: CanvasRenderingContext2D,
//         x: number,
//         y: number,
//         w: number,
//         h: number,
//         color: string
//     ) => {
//         // console.log("Call of drawRect", x, y, w, h, color);
//         ctx.clearRect(x, y, w, h);
//         ctx.fillStyle = color;
//         ctx.fillRect(x, y, w, h);
//     };

//     // BALL
//     const drawCircle = (
//         ctx: CanvasRenderingContext2D,
//         x: number,
//         y: number,
//         r: number,
//         color: string
//     ) => {
//         ctx.fillStyle = color;
//         ctx.beginPath();
//         ctx.arc(x, y, r, 0, Math.PI * 2, false); // x = X position for the ball, y = Y position for the ball, r = radius, 0= start angle &&  Match.PI*2 = End Angle (correspond à 360 degres, false = to say that we want the ball to be drawn in the clockwise direction )
//         ctx.closePath();
//         ctx.fill();
//     };

//     const drawNet = (ctx: CanvasRenderingContext2D) => {
//         for (let i = 0; i <= canvasHeight; i += 20) {
//             drawRect(ctx, canvasWidth / 2, i, 5, 10, "#FFFFFF");
//         }
//     };

//     // SCORE
//     const drawText = (
//         ctx: CanvasRenderingContext2D,
//         text: string,
//         x: number,
//         y: number,
//         color: string
//     ) => {
//         ctx.fillStyle = color;
//         ctx.font = "75px fantasy";
//         ctx.fillText(text, x, y);
//     };

//     let intervalId: any;

//     const keyPressed = (e: any) => {
//         // console.log(`Key ${e.key} was pressed`);
//         const player = getPlayerId(socket.id);

//         let direction = 1;
//         if (e.key === "w") {
//             direction = -direction;
//         }
//         let newPosY =
//             player.getPaddlePosition()[1] + player.getPaddleSpeed() * direction;
//         if (newPosY <= 0) {
//             newPosY = 0;
//         } else if (newPosY >= canvasHeight - player.getPaddleDimension()[1]) {
//             newPosY = canvasHeight - player.getPaddleDimension()[1];
//         }
//         if (e.key === "w" || e.key === "s") {
//             socket.emit("requestMovePaddle", newPosY);
//         }
//     };

//     const resetBall = async () => {
//         const [ballX, ballY] = ball.current.getPosition();
//         if (
//             ballX > 0 + ball.current.getRadius() &&
//             ballX < canvasWidth - ball.current.getRadius()
//         ) {
//             // console.log("In playing");
//             return;
//         }
//         // console.warn("Someone has scored", `BallX: ${ballX}`);

//         const newBallPos = [canvasWidth / 2, canvasHeight / 2];
//         if (socket.id === infos.allRoomInfo.playerOneId) {
//             socket.emit("requestResetPositionBall", {
//                 positions: newBallPos,
//                 canBeCollided: true,
//             });
//         }
//         // socket.on("updatePositionBall", (value) => {
//         //     ball.current.setPosition(value.positions);
//         // 	ball.current.setCanBeCollided(value.canBeCollided);
//         // });
//         ball.current.setVelocityX(-ball.current.getVelocityX());
//         resetPlayer();
//         updateScore(ballX);
//     };

//     const resetPlayer = async () => {
//         const newPlayer1Pos = [
//             10,
//             (3 * canvasHeight) / 6 -
//                 player1.current.getPaddleDimension()[1] / 2,
//         ];
//         const newPlayer2Pos = [
//             canvasWidth - 10 - player2.current.getPaddleDimension()[0],
//             (3 * canvasHeight) / 6 -
//                 player1.current.getPaddleDimension()[1] / 2,
//         ];
//         if (socket.id === infos.allRoomInfo.playerOneId) {
//             socket.emit("requestResetPositionPlayer", {
//                 player1Position: newPlayer1Pos,
//                 player2Position: newPlayer2Pos,
//             });
//         }
//     };

//     const borderCollision = async () => {
//         const [ballX, ballY] = ball.current.getPosition();
//         let [velX, velY] = ball.current.getVelocity();
//         let newPosX = ballX + velX;
//         let newPosY = ballY + velY;
//         // CHECK IF THE BALL COLLIDES WITH THE TOP OR THE BOTTOM OF THE CANVAS
//         if (
//             newPosY - ball.current.getRadius() <= 0 ||
//             newPosY + ball.current.getRadius() >= canvasHeight
//         ) {
//             velY = -velY;
//         }
//         // EMIT THE BALL MOVEMENT
//         if (socket.id === infos.allRoomInfo.playerOneId) {
//             socket.emit("requestMoveBall", {
//                 positions: [newPosX, newPosY],
//                 velocity: [velX, velY],
//             });
//         }
//         // // UPDATE THE BALL VELOCITY
//         // socket.on("updateMoveBall", (value) => {
//         //     // console.log(" BORDER COLLISION ")
//         //     ball.current.setPosition(value.positions);
//         //     ball.current.setVelocity(value.velocity);
//         // });
//         // console.warn(" BALLE =  ", ball.current.getPosition())
//         // CHECK IF THE BALL COLLIDES WITH ONE OF THE PADDLE
//     };

//     const updateBall = async () => {
//         await borderCollision();

//         // for(let i = 0; i < 1000; i++){}
//         let player;
//         if (ball.current.getPositionX() < canvasWidth / 2) {
//             // console.error("Side player 1");
//             player = player1;
//         } else {
//             // console.error("Side player 2");
//             player = player2;
//         }
//         // console.warn(" JOUEUR = ", player.current.getPaddlePosition())
//         if (collision(player.current)) {
//             // console.warn("Collision detected");
//             ballRepositioning(player.current);
//         } else if (
//             ball.current.getPositionX() > (1 * canvasWidth) / 4 &&
//             ball.current.getPositionX() < (3 * canvasWidth) / 4
//         ) {
//             ball.current.setCanBeCollided(true);
//         }
//     };

//     const collision = (player: Player) => {
//         // PLAYER SHAPES
//         player.setPaddleTop(player.getPaddlePositionY());
//         player.setPaddleBottom(
//             player.getPaddlePositionY() + player.getPaddleDimensionY()
//         );
//         player.setPaddleLeft(player.getPaddlePositionX());
//         player.setPaddleRight(
//             player.getPaddlePositionX() + player.getPaddleDimensionX()
//         );
//         // BALL SHAPES
//         const radius = ball.current.getRadius();
//         ball.current.setBallTop(ball.current.getPositionY() - radius);
//         ball.current.setBallBottom(ball.current.getPositionY() + radius);
//         ball.current.setBallLeft(ball.current.getPositionX() - radius);
//         ball.current.setBallRight(ball.current.getPositionX() + radius);

//         return (
//             // return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
//             player.getPaddleTop() < ball.current.getBallBottom() &&
//             player.getPaddleBottom() > ball.current.getBallTop() &&
//             player.getPaddleLeft() < ball.current.getBallRight() &&
//             player.getPaddleRight() > ball.current.getBallLeft()
//         );
//     };

//     const ballRepositioning = (player: Player) => {
//         let collidePoint;
//         // GET THE COLLIDE POINT ACCORDING TO THE ORIGIN OF THE PADDLE
//         // 0 --> HEIGHT OF THE PADDLE
//         collidePoint =
//             ball.current.getPositionY() -
//             (player.getPaddlePositionY() + player.getPaddleDimensionY() / 2);
//         // VIRTUAL ORIGIN
//         // GET THE COLLIDE POINT ACCORDING TO THE VIRTUAL ORIGIN OF THE PADDLE WHICH
//         // IS THE HEIGHT OF THE PADDLE / 2
//         // collidePoint = collidePoint - player.getPaddleDimensionY() / 2;
//         // NORMALIZE THE COLLIDE POINT BETWEEN [-1 --> 0] and [0 --> 1]
//         // THIS VALUE WILL BE USED FOR THE COSINUS AND SINUS CALCULATION
//         collidePoint = collidePoint / player.getPaddleDimensionY() / 2;

//         const angleRadian = (Math.PI / 4) * collidePoint;
//         const direction =
//             ball.current.getPositionX() < canvasWidth / 2 ? 1 : -1;
//         const velX =
//             Math.cos(angleRadian) * direction * ball.current.getSpeed();
//         const velY = Math.sin(angleRadian) * ball.current.getSpeed();
//         if (ball.current.getCanBeCollided() === false) {
//             // console.log("Ball can not collide anymore woth a player paddle");
//             return;
//         }
//         // EMIT THE BALL MOVEMENT
//         if (socket.id === infos.allRoomInfo.playerOneId) {
//             socket.emit("requestAfterPaddleCollision", {
//                 positions: ball.current.getPosition(),
//                 velocity: [velX, velY],
//                 canBeCollided: false,
//             });
//         }
//         // // UPDATE THE BALL VELOCITY
//         // socket.on("updateAfterPaddleCollision", (value) => {
//         //     // console.log("PADDLE COLLISION ", value)
//         //     ball.current.setPosition(value.positions);
//         //     ball.current.setVelocity(value.velocity);
//         //     ball.current.setCanBeCollided(value.canBeCollided);
//         // });
//     };

//     const updateScore = async (ballX: number) => {
//         // console.warn("Update Score", `BallX: ${ballX}`);
//         let scoredPlayerId = "";
//         if (ballX <= 0 + ball.current.getRadius()) {
//             scoredPlayerId = infos.allRoomInfo.playerTwoId;
//             // console.warn("Player TWO has scored");
//         } else if (ballX >= canvasWidth - ball.current.getRadius()) {
//             scoredPlayerId = infos.allRoomInfo.playerOneId;
//             // console.warn("Player ONE has scored");
//         }
//         if (socket.id === infos.allRoomInfo.playerOneId) {
//             // console.error("Player 1 emit an update of score");
//             socket.emit("requestPlayerScore", scoredPlayerId);
//         }
//         // socket.on("updatePlayerScore", (value) => {
//         //     player1.current.setScore(value[0]);
//         //     player2.current.setScore(value[1]);
//         // });
//     };

//     const update = async () => {
//         // socket.on("updateMovePaddle", (data) => {
//         //     // console.log(`Player ${data.player} must be updated`);
//         //     const player = getPlayerId(data.player);
//         //     player.setPaddlePosition([
//         //         player.getPaddlePosition()[0],
//         //         data.value,
//         //     ]);
//         // });
//         updateBall();
//         resetBall();
//     };

//     const render = async (
//         cs: HTMLCanvasElement,
//         ctx: CanvasRenderingContext2D
//     ) => {
//         // CLEAR THE WHOLE CANVAS
//         ctx.clearRect(0, 0, cs.width, cs.height);

//         // DRAW THE BOARD IN BLACK COLOR
//         drawRect(ctx, 0, 0, cs.width, cs.height, "#000000");

//         // DRAW THE NET
//         drawNet(ctx);

//         // DRAW THE SCORE
//         drawText(
//             ctx,
//             player1.current.getScore().toString(),
//             (1 * canvasWidth) / 4,
//             (1 * canvasHeight) / 6,
//             "#FFFFFF"
//         );
//         drawText(
//             ctx,
//             player2.current.getScore().toString(),
//             (3 * canvasWidth) / 4,
//             (1 * canvasHeight) / 6,
//             "#FFFFFF"
//         );

//         // PLAYER 1 PADDLE
//         const [p1X, p1Y] = player1.current.getPaddlePosition();
//         const [p1W, p1H] = player1.current.getPaddleDimension();

//         // PLAYER 2 PADDLE
//         const [p2X, p2Y] = player2.current.getPaddlePosition();
//         const [p2W, p2H] = player2.current.getPaddleDimension();

//         // BALL
//         const [bX, bY] = ball.current.getPosition();
//         // console.log("Ball", bX, bY);

//         // DRAW OBJECT
//         drawRect(ctx, p1X, p1Y, p1W, p1H, player1.current.getPaddleColor());
//         drawRect(ctx, p2X, p2Y, p2W, p2H, player2.current.getPaddleColor());
//         drawCircle(
//             ctx,
//             bX,
//             bY,
//             ball.current.getRadius(),
//             ball.current.getColor()
//         );
//     };

//     const mousedown = (e: MouseEvent) => {
//         // console.log(" e ", e)
//         console.log(
//             `JOUEUR : Top =  ${player2.current.getPaddleTop()} \n Right = ${player2.current.getPaddleRight()} \n Left = ${player2.current.getPaddleLeft()} \n Bottom = ${player2.current.getPaddleBottom()}`
//         );
//         console.log(
//             `BALLE  : Top =  ${ball.current.getBallTop()} \n Right = ${ball.current.getBallRight()} \n Left = ${ball.current.getBallLeft()} \n Bottom = ${ball.current.getBallBottom()}`
//         );
//         console.log("Ball collision status:", ball.current.getCanBeCollided());
//     };

//     socket.off("updatePositionPlayer").on("updatePositionPlayer", (value) => {
//         player1.current.setPaddlePosition(value.player1Position);
//         player2.current.setPaddlePosition(value.player2Position);
//     });
//     socket.off("updatePositionBall").on("updatePositionBall", (value) => {
//         ball.current.setPosition(value.positions);
//         ball.current.setCanBeCollided(value.canBeCollided);
//     });
//     // UPDATE THE BALL VELOCITY
//     socket.off("updateMoveBall").on("updateMoveBall", (value) => {
//         // console.log(" BORDER COLLISION ")
//         ball.current.setPosition(value.positions);
//         ball.current.setVelocity(value.velocity);
//     });
//     // UPDATE THE BALL VELOCITY
//     socket
//         .off("updateAfterPaddleCollision")
//         .on("updateAfterPaddleCollision", (value) => {
//             // console.log("PADDLE COLLISION ", value)
//             ball.current.setPosition(value.positions);
//             ball.current.setVelocity(value.velocity);
//             ball.current.setCanBeCollided(value.canBeCollided);
//         });
//     socket.off("updatePlayerScore").on("updatePlayerScore", (value) => {
//         player1.current.setScore(value[0]);
//         player2.current.setScore(value[1]);
//     });
//     socket.off("updateMovePaddle").on("updateMovePaddle", (data) => {
//         // console.log(`Player ${data.player} must be updated`);
//         const player = getPlayerId(data.player);
//         player.setPaddlePosition([player.getPaddlePosition()[0], data.value]);
//     });

//     useEffect(() => {
//         socket.connect(); // Will use 'handleConnection' from nestjs/game
//         socket.on("connect", () => {});
//         const cs = canvasRef.current;
//         if (!cs) {
//             return;
//         }
//         canvas.current = cs.getContext("2d");
//         if (!canvas.current) {
//             return;
//         }
//         let intervalId = 0;
//         const ctx = canvas.current;
//         const theGame = () => {
//             update();
//             render(cs, ctx);
//             if (
//                 player1.current.getScore() >= infos.allRoomInfo.totalPoint ||
//                 player2.current.getScore() >= infos.allRoomInfo.totalPoint
//             ) {
//                 resetBall();
//                 resetPlayer();
//                 cancelAnimationFrame(intervalId);
//                 intervalId = 0;
//                 if (socket.id === infos.allRoomInfo.playerOneId) {
//                     socket.emit("requestEndOfGame");
//                 }
//             } else {
//                 intervalId = requestAnimationFrame(theGame);
//             }
//         };
//         theGame();
//         cs.addEventListener("keydown", keyPressed);
//         cs.focus();
//         cs.addEventListener("mousedown", mousedown);
//         return () => {
//             if (socket) {
//                 if (intervalId) {
//                     cancelAnimationFrame(intervalId);
//                 }
//                 socket.disconnect();
//                 dispatch(updateOpponent(""));
//             }
//         };
//     }, []);

//     return (
//         <>
//             <Box>
//                 <Box
//                     sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         margin: "70px",
//                     }}
//                 >
//                     <canvas
//                         className="canvas"
//                         ref={canvasRef}
//                         width={canvasWidth}
//                         height={canvasHeight}
//                         tabIndex={0}
//                     />
//                 </Box>
//             </Box>
//             {/* onMouseMove={movePaddle} */}
//         </>
//     );
// };

// export default Game;
