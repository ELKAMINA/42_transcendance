import React from 'react'
import GifViewer from '../GifViewer'
import { Box, Stack, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './../fonts.css'; 

const myTheme = createTheme();

myTheme.typography.body1 = {
	fontFamily: 'GaramondPremrPro-BdCapt',
}

myTheme.typography.h3 = {
	fontFamily: 'GaramondPremrPro-BdCapt',
	fontSize: '1.2rem',
	'@media (min-width:600px)': {
		fontSize: '1.5rem',
	},
	[myTheme.breakpoints.up('md')]: {
		fontSize: '2rem',
	},
};

function Banned() {
	return (
		<ThemeProvider theme={myTheme}>
			<Stack 
				direction={'column'} 
				height={'100%'} 
				maxHeight={'100vh'}
				width={'auto'}
				spacing={0}
				flexGrow={1}
			>
				<GifViewer pathToGif='/assets/RUB.gif' />
				<Box
					sx={{
						width: '100%',
						backgroundColor : '#e8d6be',
						height : '55%',
						color : 'red',
						fontSize : '4em',
						display: 'flex', // Add display: 'flex' to use flexbox layout
						alignItems: 'center', // Center content vertically
						justifyContent: 'center', // Center content horizontally
					}}
				>
					<Typography variant='h3'>You have been banned, my friend.</Typography>
				</Box>
			</Stack>
		</ThemeProvider>
	)
}

export default Banned
