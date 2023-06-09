
import Cookies from 'js-cookie';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';

import './Sign.css';
import logoft from "../img/42 white.png";
import { setSignCredentials, setTokens } from '../features/auth/authSlice';
import { useSignupMutation, useSigninMutation} from '../app/api/authApiSlice';


interface Signing {
    intro: string,
    type: string,
  }

export default function Sign(props: Signing){
    const userRef = React.useRef<HTMLInputElement>(null)
    const errRef = React.useRef<HTMLInputElement>(null)

    const [nickname, setNickname] = React.useState('')
    const [password, setPwd] = React.useState('')
    const [avatar, setAvatar] = React.useState('')
    const [errMsg, setErrMsg] = React.useState('')
    const [ signin] = useSigninMutation();
    const [signup] = useSignupMutation(); // isLoading : Frequently Used Query Hook Return Values => When true, indicates that the query is currently loading for the first time, and has no data yet. This will be true for the first request fired off, but not for subsequent requests.
    const dispatch = useDispatch()
    const navigate = useNavigate();
    React.useEffect(() => {
        if (userRef && userRef.current)
            userRef.current.focus()
    }, [])

    React.useEffect(() => {
        setErrMsg('')
    }, [nickname, password])

    const ft_auth = async () => {
        window.open("http://localhost:4001/auth/42/callback", "_self");
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        try {
            let userData = null;
            if (props.type === "Sign up")
            {
                userData = await signup({ nickname, password, avatar }).unwrap() // unwrap extracts the payload of a fulfilled action or to throw either the error
            }
            else
            {
                userData = await signin({ nickname, password, avatar }).unwrap()
            }
            dispatch(setSignCredentials({...userData, nickname, avatar}))
            setNickname('')
            setPwd('')
            setAvatar('')
            if (userData.faEnabled === true)
            {
                navigate('/tfa')
            }
            else
                navigate('/welcome')
        } catch (err: any) {
            if (!err)
                setErrMsg('No Server Response');
            else
             setErrMsg(err.data.message);
            if (errRef && errRef.current)
                errRef.current.focus();
        }
    }
    // const content = isLoading  ? <h1> Loading ... </h1> : (
    const content = (
        <div className='sign'>
            <h2 className='sign-intro'>{props.intro}</h2>
            <form id='form'>
                <input
                    type="text"
                    placeholder="Nickname" 
                    onChange={(e)=> setNickname(e.target.value)}
                    ref={userRef}
                    value={nickname}
                    required
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=> setPwd(e.target.value)}
                    required
                />
            </form>
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="contained-button-file"
                value={avatar}
                onChange={(e)=>setAvatar(e.target.value)}
            />
            <label htmlFor="contained-button-file">
                <IconButton color="primary" component="span">
                    <Avatar/>
                    Upload your avatar
                </IconButton>
            </label>
            <Button className="mui-btn" type="submit" variant="contained" onClick={handleSubmit}>{props.type}</Button>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <hr></hr>
            <Button className="mui-btn-ft" type="submit" variant="contained" onClick={ft_auth} ><span>{props.type} with</span><img src={logoft} alt="42" width={"20px"}/></Button>
        </div>
    )
    return content;
}