import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export type HandlePwdFunction = (pwd: string) => void;

interface PasswordFieldProps {
	passwordFieldId: string;
  	handlePwd: HandlePwdFunction;
	isPwdCorrect?: boolean;
}

export default function PasswordField({ handlePwd,  passwordFieldId, isPwdCorrect}: PasswordFieldProps) {
	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value
		handlePwd(value);
	}

	return (
		<Box sx={{ display: 'flex', flexWrap: 'wrap'}}>
			<FormControl error={!isPwdCorrect} sx={{ width: '100%' }} variant="outlined" color={isPwdCorrect? 'success' : 'warning'}>
				<InputLabel htmlFor={passwordFieldId}>password</InputLabel>
				<OutlinedInput
					onChange={handleChange}
					id={passwordFieldId}
					type={showPassword ? 'text' : 'password'}
					endAdornment={
					<InputAdornment position="end">
						<IconButton
						aria-label="toggle password visibility"
						onClick={handleClickShowPassword}
						onMouseDown={handleMouseDownPassword}
						edge="end"
						>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
					}
					label="Password"
					sx={{
						'& input': {
							backgroundColor: 'transparent',
							boxShadow: 'none',
						},
					}}
				/>
			</FormControl>
		</Box>
	);
}
