import clsx from 'clsx';
import { store } from '../app/store';
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import Grid from '@mui/material/Grid'; // Grid version 1
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';



import './chat.css'
import './game.css'
import Navbar from '../components/NavBar';
import { Matchmaking } from '../components/MatchMaking'
import { transformData } from './userProfile';
import { FetchUserByName } from '../utils/global/global';
import { updateOpponent, selectOpponent } from '../redux-features/game/gameSlice'
import { selectCurrentUser } from '../redux-features/auth/authSlice';
import { useAppSelector, useAppDispatch } from '../utils/redux-hooks';
import { FetchActualUser, getActualUser, selectActualUser } from '../redux-features/friendship/friendshipSlice';
import { useNavigate } from 'react-router-dom';

export const socket = io('http://localhost:4010', {
  withCredentials: true,
  transports: ['websocket'],
  upgrade: false,
  autoConnect: false,
});

const halfGridStyle = {
	height: '100vh',
	background: 'rgba(255, 255, 255, 0.5)',
  };
  
  const waitingGridStyle = {
	height: '100vh',
	backgroundColor: '#AFDBF5',
	color: '#005A9C'
  };

function Game () {
	const currentRoute = window.location.pathname;
	const dispatch = useAppDispatch();
	const [startingGame, setStarting] = useState(false)
	const nickName = useAppSelector(selectCurrentUser);
	const user = useAppSelector(selectActualUser);
	const navigate = useNavigate()

	
	useEffect(() => {
		if (user.status !== 'Playing'){
			socket.connect(); // Will use 'handleConnection' from nestjs/game
			socket.on('connect', () => {
				console.log('I\'m connected, id is = ', socket.id);
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
				console.log('new room id', newRoom);
			})
			console.log('jarrive jusque la ')

			socket.on("gameBegin", (roomInfo) => {
				dispatch(updateOpponent(roomInfo.opponent))
				setTimeout(()=> {
					setStarting(true)
					socket.on('forceDisconnection', () => {
						navigate("/welcome");
					})
					// navigate('/pong', { state: {roomInfo}})
				}, 5000)
			})
			socket.on('forceDisconnection', () => {
				navigate("/welcome");
			})
		}
		else {
			console.log('I tried to cheat and took a shorcut to a game');
			navigate("/welcome");
		}
		return () => {
			dispatch(updateOpponent(""))
			if (socket){
				console.log('I\'m getting disconnected, id is = ', socket.id);
				socket.disconnect()
			}

		}
	}, [])

	const opp = useAppSelector(selectOpponent)
	return (
		<>
			<Navbar currentRoute={currentRoute} />
			{startingGame === false && <Matchmaking opp={opp} nickname={nickName}/>}
			{startingGame === true && <Pong/>}	
		</>
	)
}

type BallType = {
	x: number;
	y: number;
	dx: number;
	dy: number;
  };

function Pong () {
	const currentRoute = window.location.pathname;
	const dispatch = useAppDispatch();
	const nickName = useAppSelector(selectCurrentUser);
	const user = useAppSelector(selectActualUser);
	const location = useLocation();

	const roomInfo = location.state;
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [paddleY, setPaddleY] = useState<number>(200);
	const [ball, setBall] = useState<BallType>({ x: 10, y: 10, dx: 2, dy: 2 });
  
	const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
	  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	  ctx.fillStyle = '#000000';
	  ctx.fillRect(50, paddleY, 20, 80);
	  ctx.fillRect(50, paddleY, 20, 80);
	  ctx.beginPath();
	  ctx.arc(ball.x, ball.y, 10, 0, 2*Math.PI);
	  ctx.fill();
	};
  
	const update = () => {
	  setBall(ball => ({
		x: ball.x + ball.dx,
		y: ball.y + ball.dy,
		dx: (ball.x + ball.dx > 800 || ball.x + ball.dx < 0) ? -ball.dx : ball.dx,
		dy: (ball.y + ball.dy > 400 || ball.y + ball.dy < 0) ? -ball.dy : ball.dy
	  }));
	  if (ball.x <= 70 && ball.x >= 50 && ball.y >= paddleY && ball.y <= paddleY + 80) {
		setBall(ball => ({ ...ball, dx: -ball.dx }));
	  }
	};

	const mouseDown = (e: any) => {
		console.log('jai bougé la souris ', e)
	}
  
	useEffect(() => {
		socket.connect(); // Will use 'handleConnection' from nestjs/game
		socket.on('connect', () => {

		});
	  const canvas = canvasRef.current;
	  if (!canvas){
		return;
	  }
	  const context = canvas?.getContext('2d');
	  if (!context){
		return ;
	  }
	  canvas.addEventListener('mousedown', mouseDown)
	//   let frameCount = 0;
	//   let animationFrameId: number;
  
	//   const render = () => {
	// 	frameCount++;
	// 	if(context) {
	// 	  draw(context, frameCount);
	// 	}
	// 	update();
	// 	animationFrameId = window.requestAnimationFrame(render);
	//   };
	//   render();
  
	  return () => {
		// window.cancelAnimationFrame(animationFrameId);
	  };
	}, []);
  
	// const movePaddle = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
	//   const newPaddleY = event.clientY - 40;
	//   setPaddleY(newPaddleY);
	// };
  
	useEffect(() => {
		// socket.emit('connectedSocket', {})
		
		return () => {
			if (socket) {
				socket.disconnect();
				dispatch(updateOpponent(""))
			}

		}
	}, [])
	
	return (
		<>
			{/* <Navbar currentRoute={currentRoute} /> */}
			<Box>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					// justifyContent: 'space-around',
					margin: '70px',
				}}>
					<canvas className="canvas" ref={canvasRef} width="1000" height="600"  />
				</Box>
			</Box>
			{/* onMouseMove={movePaddle} */}

		</>
	)
}

export default Game;