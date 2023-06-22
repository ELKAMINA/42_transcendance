import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type HandlePwdFunction = (pwd: string) => void;

interface PasswordFieldProps {
  handlePwd: HandlePwdFunction;
}

export default function PasswordField({ handlePwd }: PasswordFieldProps) {

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
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          	<InputLabel htmlFor="outlined-adornment-password">password</InputLabel>
          	<OutlinedInput
				onChange={handleChange}
            	id="outlined-adornment-password"
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
