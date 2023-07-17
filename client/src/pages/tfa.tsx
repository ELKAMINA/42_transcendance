import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector} from '../utils/redux-hooks';

import './home.css';
import api from '../utils/Axios-config/Axios'
import { selectCurrentAccessToken, selectCurrentUser, setTokens } from '../redux-features/auth/authSlice';
import { useTfaAuthenticateMutation } from '../app/api/authApiSlice';
import axios from 'axios';

function Tfa () {
    const dispatch = useAppDispatch();
    const nickname = useAppSelector(selectCurrentUser)
	const access_token = useAppSelector(selectCurrentAccessToken)
    const navigate = useNavigate();
    let [TfaCode, setTfaCode] = React.useState('')
    const [tfaAuthenticate] = useTfaAuthenticateMutation();

    const handleSubmit = async () => {
        try {
			console.log('access_token du gars ', access_token)
			await api.post('http://localhost:4001/auth/2fa/authenticate', {TfaCode, nickname})
			.then((res) => {
				navigate('/welcome')
			})
			.catch((e)=> {console.log('Error from 2fa authentication', e)})		  
        }
        catch{
          console.log('this is shit')
        }
      }
    return (
        <div>
        <h1>This is the TFA Authentication Page : Validation Code </h1>
        <form id='form'>
        <input
          type="text"
          onChange={(e)=> setTfaCode(e.target.value)}
          placeholder="Tfa-Code"
          value={TfaCode}
          required
          />
        </form>
        <Button className="mui-btn" type="submit" variant="contained" onClick={handleSubmit}>Send code</Button>
      </div>
    )
}

export default Tfa;