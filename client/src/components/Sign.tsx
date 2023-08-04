
import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import './Sign.css';
import logoft from "../img/42 white.png";
import { useNavigate } from 'react-router-dom';
import { UserModel } from '../types/users/userType';
import { useAppDispatch } from '../utils/redux-hooks';
import { FetchUserByName } from '../utils/global/global';
import { useSignupMutation, useSigninMutation} from '../app/api/authApiSlice';
import { setSignCredentials, setAvatar, setNick, resetAuthStore } from '../redux-features/auth/authSlice';
import { resetChannelName, resetChannelNameStore } from '../redux-features/chat/createChannel/channelNameSlice';
import { resetChannelStore } from '../redux-features/chat/channelsSlice';
import { resetChannelType } from '../redux-features/chat/createChannel/channelTypeSlice';


interface Signing {
    intro: string,
    type: string,
  }

export default function Sign(props: Signing){
    const dispatch = useAppDispatch();
    const userRef = React.useRef<HTMLInputElement>(null)
    const errRef = React.useRef<HTMLInputElement>(null)
    const [nickname, setNickname] = React.useState('')
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [password, setPwd] = React.useState('')
    const [avtr, setAr] = React.useState('')
    const [tfaCode, setTfaCode] = React.useState('')
    const [errMsg, setErrMsg] = React.useState('')
    // const tfaInput = useAppSelector(selectTfaInput)
    const [ signin] = useSigninMutation();
    const [signup] = useSignupMutation(); // isLoading : Frequently Used Query Hook Return Values => When true, indicates that the query is currently loading for the first time, and has no data yet. This will be true for the first request fired off, but not for subsequent requests.
    const navigate = useNavigate()

    React.useEffect(() => {
        dispatch(resetAuthStore())
        dispatch(resetChannelType())
        dispatch(resetChannelName())
        dispatch(resetChannelStore())
        dispatch(resetChannelNameStore())
        if (userRef && userRef.current)
            userRef.current.focus()
    }, [])

    React.useEffect(() => {
        setErrMsg('')
    }, [nickname, password])

    const ft_auth = async () => {
        window.open("http://localhost:4001/auth/42/callback", "_self");
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const imageSrc = reader.result as string;
            setSelectedImage(imageSrc);
          };
          reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        fileInput?.click();
    
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        try {
            let userData = null;
            let avatar: string = '';
            if (selectedImage)
            {
                dispatch(setAvatar(selectedImage));
                setAr(selectedImage)
                avatar = selectedImage;
            }
            if (props.type === "Sign up")
            {
                userData = await signup({ nickname, password, avatar, type: 'notTfa' }).unwrap() // unwrap extracts the payload of a fulfilled action or to throw either the error
                // console.log(userData)
            }
            else
            {
				const user: UserModel = await FetchUserByName(nickname)
                if (user.faEnabled)
                {
                    dispatch(setNick(nickname))
                    return (navigate('/tfa'))
                }
                else {
                    userData = await signin({ nickname, password, avatar, type: 'notTfa' }).unwrap()
                }
            }
            dispatch(setSignCredentials({...userData, nickname}))
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
                id="image-upload"
                type="file" accept="image/*" onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
            <IconButton onClick={handleButtonClick}> Upload your avatar </IconButton>
            {selectedImage && <Avatar src={selectedImage}/>}
            <Button className="mui-btn" type="submit" variant="contained" onClick={handleSubmit}>{props.type}</Button>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <hr></hr>
            {/* {tfaInput === true && 
            <>
                <form>
                    <input
                        placeholder="tfaCode"
                        onChange={(e) => setTfaCode(e.target.value)}
                        value={tfaCode}

                    />
                </form>
                <Button className="mui-btn" type="submit" variant="contained" onClick={handleSubmitTfaCode}>Send code</Button>
            </>
            } */}
            <Button className="mui-btn-ft" type="submit" variant="contained" onClick={ft_auth} ><span>{props.type} with</span><img src={logoft} alt="42" width={"20px"}/></Button>
        </div>
    )
    return content;
}