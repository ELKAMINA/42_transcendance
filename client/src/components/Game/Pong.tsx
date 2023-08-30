import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/NavBar";
import { IPongProps } from "../../interface/IClientGame";
import { socket } from "../../pages/game";
import Player from "../../classes/Player";
import Ball from "../../classes/Ball";

export const Pong: React.FC<IPongProps> = ({ room }) => {
    const currentRoute = window.location.pathname;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvas = useRef<CanvasRenderingContext2D | null>(null);
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
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

    /***************************************************************************/
    /*** UTILS FUNCTIONS ***/
    const getPlayerId = (socketId: string) => {
        if (socketId === room.playerOneId) {
            return player1.current;
        } else {
            return player2.current;
        }
    };

    /***************************************************************************/
    /*** DRAWING FUNCTIONS ***/
    // PLAYER PADDLE
    const drawRect = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        color: string
    ) => {
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
    // const drawText = (
    //     ctx: CanvasRenderingContext2D,
    //     text: string,
    //     x: number,
    //     y: number,
    //     color: string
    // ) => {
    //     ctx.fillStyle = color;
    //     ctx.font = "75px fantasy";
    //     ctx.fillText(text, x, y);
    // };

    /***************************************************************************/
    /*** PLAYER EVENTS  ***/
    // TODO: CHANGE ARROW FUNCTION BY A CLASSICAL ONE TO MAKE SURE
    // ABOUT THE CANVAS DIMENSION
    // const keyPressed = useRef<any>()

    const keyPressed = (e: any) => {
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
        // console.log(
        //     "[Pong - mousedown]",
        //     `JOUEUR : Top =  ${player2.current.getPaddleTop()} \n Right = ${player2.current.getPaddleRight()} \n Left = ${player2.current.getPaddleLeft()} \n Bottom = ${player2.current.getPaddleBottom()}`
        // );
        // console.log(
        //     "[Pong - mousedown]",
        //     `BALLE  : Top =  ${ball.current.getBallTop()} \n Right = ${ball.current.getBallRight()} \n Left = ${ball.current.getBallLeft()} \n Bottom = ${ball.current.getBallBottom()}`
        // );
        // console.log("Ball collision status:", ball.current.getCanBeCollided());
    };

    /***************************************************************************/
    /*** RENDER FUNCTIONS ***/
    // eslint-disable-next-line
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

        // DEPRICATED BECAUSE THE SCORE IS NOW DISPLAYED IN A DEDICATDE BANNER
        // DRAW THE SCORE
        // drawText(
        //     ctx,
        //     player1.current.getScore().toString(),
        //     (1 * canvasWidth) / 4,
        //     (1 * canvasHeight) / 6,
        //     room.scoreColor
        // );
        // drawText(
        //     ctx,
        //     player2.current.getScore().toString(),
        //     (3 * canvasWidth) / 4,
        //     (1 * canvasHeight) / 6,
        //     room.scoreColor
        // );

        // PLAYER 1 PADDLE
        const [p1X, p1Y] = player1.current.getPaddlePosition();
        const [p1W, p1H] = player1.current.getPaddleDimension();

        // PLAYER 2 PADDLE
        const [p2X, p2Y] = player2.current.getPaddlePosition();
        const [p2W, p2H] = player2.current.getPaddleDimension();

        // BALL
        const [bX, bY] = ball.current.getPosition();

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

    socket.off("updatePositionPlayer").on("updatePositionPlayer", (value) => {
        player1.current.setPaddlePosition(value.player1Position);
        player2.current.setPaddlePosition(value.player2Position);
    });
    socket.off("updatePositionBall").on("updatePositionBall", (value) => {
        ball.current.setPosition(value.positions);
        ball.current.setCanBeCollided(value.canBeCollided);
    });
    socket.off("updateSpeedBall").on("updateSpeedBall", (value) => {
        ball.current.setSpeed(value.speed);
        ball.current.setVelocity(value.velocity);
    });
    // UPDATE THE BALL VELOCITY
    socket.off("updateMoveBall").on("updateMoveBall", (value) => {
        ball.current.setPosition(value.positions);
        ball.current.setVelocity(value.velocity);
    });
    // UPDATE THE BALL VELOCITY
    socket
        .off("updateAfterPaddleCollision")
        .on("updateAfterPaddleCollision", (value) => {
            ball.current.setPosition(value.positions);
            ball.current.setVelocity(value.velocity);
            ball.current.setSpeed(value.speed);
            ball.current.setCanBeCollided(value.canBeCollided);
        });
    socket.off("updatePlayerScore").on("updatePlayerScore", (value) => {
        player1.current.setScore(value[0]);
        player2.current.setScore(value[1]);
        setPlayer1Score(player1.current.getScore());
        setPlayer2Score(player2.current.getScore());
    });
    socket.off("updateMovePaddle").on("updateMovePaddle", (data) => {
        player1.current.setPaddlePosition(data.player1Position);
        player2.current.setPaddlePosition(data.player2Position);
    });
    socket.off("endGame").on("endGame", () => {
        // console.log("[Pong - on EndGame]", "endGame");
        if (intervalId) {
            cancelAnimationFrame(intervalId);
        }
    });

    /***************************************************************************/
    /*** COMPONENT EFECT ***/
    // HANDLE THE GAME
    useEffect(() => {
        const cs = canvasRef.current;
        if (!cs) {
            console.error("[Pong - useEffect]", "NO HTML CANVAS ELEMENT");
            return;
        }
        canvas.current = cs.getContext("2d");
        if (!canvas.current) {
            console.error(
                "[Pong - useEffect]",
                "NO CANVAS RENDERING CONTEXT 2D"
            );
            return;
        }
        let intervalId = 0;
        const ctx = canvas.current;
        const theGame = () => {
            render(cs, ctx);
            if (
                player1.current.getScore() >= room.totalPoint ||
                player2.current.getScore() >= room.totalPoint
            ) {
                // console.warn("[Pong - theGame]", "End game");
                if (intervalId) {
                    cancelAnimationFrame(intervalId);
                    intervalId = 0;
                }
            } else {
                intervalId = requestAnimationFrame(theGame);
            }
        };
        theGame();
        cs.addEventListener("keydown", keyPressed);
        // SET THE FOCUS OF THE MOUSE INSIDE OF THE CANVAS
        cs.focus();
        cs.addEventListener("mousedown", mousedown);
        // TEST RESPONSIVE
        // window.addEventListener("resize", function (event) {
        //     var newWidth = window.innerWidth;
        //     var newHeight = window.innerHeight;
        //     console.log("newWidth: ", newWidth, "newHeight: ", newHeight);
        // });
        return () => {
            if (intervalId) {
                cancelAnimationFrame(intervalId);
                intervalId = 0;
            }
        };
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Navbar currentRoute={currentRoute} />
            <div className="pongWrapper">
                <div className="pongHelpOverview">
                    <div className="pongHelp">
                        How to play:
                        <br />
                        <strong>Move up</strong> = W and{" "}
                        <strong>Move down</strong> = S
                    </div>
                </div>
                <div className="pongBannerOverview">
                    <div className="pongBanner">
                        <div className="pongBannerPlayerName">
                            <div className="pongBannerPlayerName1">
                                {room.players[0]}
                            </div>
                        </div>
                        <div className="pongBannerPlayerScore">
                            <div className="pongBannerPlayerScore1">
                                {player1Score}
                            </div>
                            <div className="pongBannerVersus">VS</div>
                            <div className="pongBannerPlayerScore2">
                                {player2Score}
                            </div>
                        </div>
                        <div className="pongBannerPlayerName">
                            <div className="pongBannerPlayerName2">
                                {room.players[1]}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pongGameSlice">
                    <canvas
                        className="pongGameCanvas"
                        ref={canvasRef}
                        width={canvasWidth}
                        height={canvasHeight}
                        tabIndex={0}
                    />
                </div>
            </div>
        </>
    );
};

export default Pong;
