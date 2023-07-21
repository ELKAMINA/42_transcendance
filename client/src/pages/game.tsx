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
	const ctx = useRef<CanvasRenderingContext2D | null>(null);

		/*Why useRef : unlike state updates, changes to a ref's .current property do not trigger a re-render of the component. This makes it useful for values that need to persist across renders but changes in these values should not cause an update to the component's output*/
	const [paddleY, setPaddleY] = useState<number>(200);
	const [ball, setBall] = useState<BallType>({ x: 10, y: 10, dx: 2, dy: 2 });
  
	/* Drawing functions  */
	const drawRect = (ctx:CanvasRenderingContext2D, x: number,y: number, w: number, h: number, color: string) => {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillStyle = color;
		ctx?.fillRect(x, y, w, h); 
	}

	const drawCircle = (ctx: CanvasRenderingContext2D,x: number,y: number, r: number, color: string) => {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI*2, false); // x = X position for the ball, y = Y position for the ball, r = radius, 0= start angle &&  Match.PI*2 = End Angle (correspond à 360 degres, false = to say that we want the ball to be drawn in the clockwise direction )
		ctx.closePath()
		ctx.fill(); 
	}

	const drawText = (ctx:CanvasRenderingContext2D, text: string, x: number,y: number, color: string) => {
		ctx.fillStyle = color;
		ctx.font = "75px fantasy"
		ctx.fillText(text, x, y); 
	}

	const drawNet = (ctx:CanvasRenderingContext2D, text: string, x: number,y: number, color: string) => {
		ctx.fillStyle = color;
		ctx.font = "75px fantasy"
		ctx.fillText(text, x, y); 
	}

	/* ***  */
  

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
	  ctx.current = canvas.getContext('2d');
	  if (!ctx){
		return ;
	  }
	  // clear the canvas before every re-render
	  ctx.current?.clearRect(0,0, canvas.width, canvas.height)
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
  
  
	useEffect(() => {
		
		return () => {
			if (socket) {
				socket.disconnect();
				dispatch(updateOpponent(""))
			}

		}
	}, [])
	
	return (
		<>
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