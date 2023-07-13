import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch} from '../utils/redux-hooks';
import { useSelector } from 'react-redux';

import './home.css';
import api from '../utils/Axios-config/Axios'
import { selectCurrentUser, setTokens } from '../redux-features/auth/authSlice';
import { useTfaAuthenticateMutation } from '../app/api/authApiSlice';

function Tfa () {
    const dispatch = useAppDispatch();
    const nickname = useSelector(selectCurrentUser)
    const navigate = useNavigate();
    let [TfaCode, setTfaCode] = React.useState('')
    const [tfaAuthenticate] = useTfaAuthenticateMutation();

    const handleSubmit = async () => {
        // await api
        // .post("http://0.0.0.0:4001/auth/2fa/authenticate", {TfaCode, nickname})
        // .then((res) => {
        //   console.log('je dois absolument rentrer ic')
        //   dispatch(setTokens({...res.data})); navigate('/welcome')})
        // .catch((e) => {console.log("error ", e)});
        const tfaAuthenitcation = await tfaAuthenticate({TfaCode, nickname}).unwrap()
        // console.log('tfaaaaa ', tfaAuthenitcation)
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