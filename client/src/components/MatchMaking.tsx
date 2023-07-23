
import Grid from '@mui/material/Grid'; // Grid version 1
import { Typography } from '@mui/material';
import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from '../utils/redux-hooks';
import { gameInfo } from '../data/gameInfo';
import { selectCurrentUser } from '../redux-features/auth/authSlice';


interface Myprops {
	opp: string | null
	nickname: string | null
}

const halfGridStyle = {
	height: '100vh',
	background: 'rgba(255, 255, 255, 0.5)',
  };
  
  const waitingGridStyle = {
	height: '100vh',
	backgroundColor: '#AFDBF5',
	color: '#005A9C'
  };

  interface PongProps {
	infos: gameInfo;
	nickname: string,
}

  export const Matchmaking : React.FC<PongProps> = ({infos}, props: Myprops)  => {
	const user = useAppSelector(selectCurrentUser);
	console.log(`Le user est ${user }, le nick = ${props.nickname} et l'opponent est = ${props.opp}`)
	useEffect(() => {

		return () => {


		}
	}, [])

	return (
		<>
			<Grid container spacing={1} alignItems="center">
				{infos.opponent && 
				(<>
					<Grid container sx={{
						backgroundImage: `url(${process.env.PUBLIC_URL + '/thisone.avif'})`,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
						imageRendering: 'auto',
						height: '95vh',
						width: '100wh',
						zIndex: 0,
					}}>
						<Grid item style={halfGridStyle} xs={6} sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
							<Typography variant="h3" sx={{
								color: 'white',
								fontSize: "50px",
								textTransform: 'uppercase',

							}}>{infos.allRoomInfo.players[0]}</Typography>
						</Grid>
						{/* <Typography variant="h3" noWrap>VS</Typography> */}
						<Grid item style={halfGridStyle} xs={6} sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
							<Typography variant="h3" noWrap sx={{
								color: 'white',
								fontSize: "50px",
								textTransform: 'uppercase',
							}}>{infos.allRoomInfo.players[1]}</Typography>
						</Grid>
					</Grid>
				</>)
				}
				{!infos.opponent && <Grid item xs={12} style={waitingGridStyle} sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
					<Typography variant="h2" noWrap>Waiting for your opponent </Typography>
					<CircularProgress color="primary"/>
				</Grid>}
			</Grid>
		</>
	)
}