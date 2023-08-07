import { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid"; // Grid version 1
import { Box } from "@mui/material";
import Navbar from "../../components/NavBar";
import { IPongProps } from "../../interface/IClientGame";
import { socket } from "../../pages/game";
import Player from "../../classes/Player";
import Ball from "../../classes/Ball";

export const Pong: React.FC<IPongProps> = ({ room }) => {
    const currentRoute = window.location.pathname;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvas = useRef<CanvasRenderingContext2D | null>(null);
    // TODO: USE THE CANVAS DIMENSION
    const [canvasWidth, canvasHeight] = [800, 600];
    const player1 = useRef<Player>(
        new Player(
            [room.playerOneId, room.players[0]],
            [0, 0],
            20,
            room.paddleColor
        )
    );
    const player2 = useRef<Player>(
        new Player(
            [room.playerTwoId, room.players[1]],
            [0, 0],
            20,
            room.paddleColor
        )
    );
    const ball = useRef<Ball>(new Ball([0, 0], 5, room.ballColor));

    player1.current.setPaddlePosition([
        10,
        (3 * canvasHeight) / 6 - player1.current.getPaddleDimension()[1] / 2,
    ]);
    player2.current.setPaddlePosition([
        canvasWidth - 10 - player2.current.getPaddleDimension()[0],
        (3 * canvasHeight) / 6 - player2.current.getPaddleDimension()[1] / 2,
    ]);
    ball.current.setPosition([canvasWidth / 2, canvasHeight / 2]);

    // VARIABLE TO STOP SETINTERVAL
    let intervalId: any;

    /*** UTILS FUNCTIONS  ***/
    const update = async () => {
        socket.on("updateMovePaddle", (data) => {
            // console.log(`Player ${data.player} must be updated`);
            const player = getPlayerId(data.player);
            player.setPaddlePosition([
                player.getPaddlePosition()[0],
                data.value,
            ]);
        });
        // updateBall();
        // resetBall();
    };

    const getPlayerId = (socketId: string) => {
        if (socketId === room.playerOneId) {
            return player1.current;
        } else {
            return player2.current;
        }
    };

    /*** DRAWING FUNCTIONS  ***/
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

    const drawNet = (ctx: CanvasRenderingContext2D) => {
        for (let i = 0; i <= canvasHeight; i += 20) {
            drawRect(ctx, canvasWidth / 2, i, 5, 10, room.netColor);
        }
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

    /*** PLAYER EVENT  ***/
    // TODO: CHANGE ARROW FUNCTION BY A CLASSICAL ONE TO MAKE SURE
    // ABOUT THE CANVAS DIMENSION
    const keyPressed = (e: any) => {
        // console.log(`Key ${e.key} was pressed`);
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

    const mousedown = (e: MouseEvent) => {
        console.log(
            `JOUEUR : Top =  ${player2.current.getPaddleTop()} \n Right = ${player2.current.getPaddleRight()} \n Left = ${player2.current.getPaddleLeft()} \n Bottom = ${player2.current.getPaddleBottom()}`
        );
        console.log(
            `BALLE  : Top =  ${ball.current.getBallTop()} \n Right = ${ball.current.getBallRight()} \n Left = ${ball.current.getBallLeft()} \n Bottom = ${ball.current.getBallBottom()}`
        );
        console.log("Ball collision status:", ball.current.getCanBeCollided());
        player1.current.setScore(2);
    };

    const render = async (
        cs: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
    ) => {
        // CLEAR THE WHOLE CANVAS
        ctx.clearRect(0, 0, cs.width, cs.height);

        // DRAW THE BOARD IN BLACK COLOR
        drawRect(ctx, 0, 0, cs.width, cs.height, room.boardColor);

        // DRAW THE NET
        drawNet(ctx);

        // DRAW THE SCORE
        drawText(
            ctx,
            player1.current.getScore().toString(),
            (1 * canvasWidth) / 4,
            (1 * canvasHeight) / 6,
            room.scoreColor
        );
        drawText(
            ctx,
            player2.current.getScore().toString(),
            (3 * canvasWidth) / 4,
            (1 * canvasHeight) / 6,
            room.scoreColor
        );

        // PLAYER 1 PADDLE
        const [p1X, p1Y] = player1.current.getPaddlePosition();
        const [p1W, p1H] = player1.current.getPaddleDimension();

        // PLAYER 2 PADDLE
        const [p2X, p2Y] = player2.current.getPaddlePosition();
        const [p2W, p2H] = player2.current.getPaddleDimension();

        // BALL
        const [bX, bY] = ball.current.getPosition();
        // console.log("Ball", bX, bY);

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

    // HANDLE THE GAME
    useEffect(() => {
        const cs = canvasRef.current;
        if (!cs) {
            console.warn("TEST");
            return;
        }
        canvas.current = cs.getContext("2d");
        if (!canvas.current) {
            return;
        }
        let intervalId = 0;
        const ctx = canvas.current;
        const theGame = () => {
            update();
            render(cs, ctx);
            if (
                player1.current.getScore() >= room.totalPoint ||
                player2.current.getScore() >= room.totalPoint
            ) {
                // resetBall();
                // resetPlayer();
                cancelAnimationFrame(intervalId);
                intervalId = 0;
                socket.emit("requestEndOfGame");
            } else {
                intervalId = requestAnimationFrame(theGame);
            }
        };
        theGame();
        cs.addEventListener("keydown", keyPressed);
        cs.focus();
        // cs.addEventListener("mousedown", mousedown);
        // TEST RESPONSIVE
        window.addEventListener("resize", function (event) {
            var newWidth = window.innerWidth;
            var newHeight = window.innerHeight;
            console.log("newWidth: ", newWidth, "newHeight: ", newHeight);
        });
        return () => {
            if (socket) {
                if (intervalId) {
                    cancelAnimationFrame(intervalId);
                }
                // socket.disconnect();
                // dispatch(updateOpponent(""));
            }
        };
    }, []);

    return (
        <>
            <Navbar currentRoute={currentRoute} />
            <div className="wrapper">
                <div className="container">
                    <div className="canvas-container">
                        {/* <canvas id="main" width="1024" height="640"></canvas> */}
                        <canvas
                            className="pongCanvas"
                            ref={canvasRef}
                            width={canvasWidth}
                            height={canvasHeight}
                            tabIndex={0}
                        />
                    </div>
                </div>
            </div>
            {/* <Grid container spacing={1} alignItems="center">
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
                </>
            </Grid> */}
        </>
    );
};

export default Pong;
