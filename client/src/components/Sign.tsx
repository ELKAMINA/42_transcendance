
import * as React from 'react';
import { useState } from 'react';
import { Box, Container, FormControl, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
// import { MuiFileInput } from 'mui-file-input'
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';

// import './Sign.css';
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
    const [value, setValue] = React.useState(null)
    const [nickname, setNickname] = React.useState('')
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [password, setPwd] = React.useState('')
    const [avtr, setAr] = React.useState('')
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if ( data === null) {
            setErrMsg('Form is null');
            return ;
        }
        const nicknameValue = data.get('nickname');
        const passwordValue = data.get('password');
        if (nicknameValue === null || passwordValue === null) {
            setErrMsg('Nickname or password is missing');
            return;
        }
        const nickname: string = nicknameValue.toString();
        const password: string = passwordValue.toString();
        try {
            let userData = null;
            let avatar: string = '';
            if (selectedImage)
            {
                dispatch(setAvatar(selectedImage));
                setAr(selectedImage)
                avatar = selectedImage;
            }
            if (props.type === "Sign up"){
                userData = await signup({ nickname, password, avatar, type: 'notTfa' }).unwrap() // unwrap extracts the payload of a fulfilled action or to throw either the error
            }
            else{
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
            if (err){
                if (err.status === 400)
                {
                    setErrMsg("Please check that nickname/password are not empty OR \n Password is at least 6 characters");
                }
            }
            if (!err)
                setErrMsg('No Server Response');
            if (errRef && errRef.current)
                errRef.current.focus();
        }
        setNickname('')
        setPwd('')
        setAr('')
    }

    const handleChange = (newValue: any) => {
      setValue(newValue)
    }
    
    const content = (
        <Container>
            <CssBaseline/>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Nickname"
                    name="nickname"
                    autoComplete="nickname"
                    autoFocus
                    sx={{
                        color: 'whitesmoke',
                      }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    helperText={errMsg}
                    autoComplete="current-password"
                    sx={{
                        '& .MuiFormHelperText-root': {
                          color: 'red', // Your custom color
                        },
                      }}
                />
                <FormControl 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                <input
                    id="image-upload"
                    type="file" accept="image/*" onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
                <IconButton onClick={handleButtonClick}> 
                <Avatar 
                    src={selectedImage} 
                    style={{
                    margin: "10px",
                    width: "60px",
                    height: "60px",
                    }} 
                    />
                </IconButton>
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                {props.type}
                </Button>
                <Button 
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1.5, mb: 2 }}
                    onClick={ft_auth} ><span>{props.type} with</span><img src={logoft} alt="42" width={"20px"}/>
                </Button>
                {/* <Typography sx={{
                    color: 'red',
                }}
                ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</Typography> */}
            </Box>
        </Container>
    )
    return content;
}