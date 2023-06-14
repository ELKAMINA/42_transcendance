import * as React from 'react';
import { useDispatch } from "react-redux"
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import './home.css';
import api from '../utils/Axios-config/Axios'
import { setTokens } from '../redux-features/auth/authSlice';

function Tfa () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let [TfaCode, setTfaCode] = React.useState('')

    const handleSubmit = async () => {
        await api
        .post("http://0.0.0.0:4001/auth/2fa/authenticate", {TfaCode})
        .then((res) => {dispatch(setTokens({...res.data})); navigate('/welcome')})
        .catch((e) => {console.log("error ", e)});
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