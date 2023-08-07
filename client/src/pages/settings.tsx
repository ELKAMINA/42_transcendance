
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../utils/redux-hooks'; // These typed hooks are different from the authSlice, because, as we're using redux thunks inside slices, we need specific typing for typescript
import { io } from 'socket.io-client';
import { Container, FormControl, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Popup from 'reactjs-popup';
import Cookies from 'js-cookie';
import { selectCurrentUser, setNick, setMail, setAvatar, setTfaAuth, selectTfaAuth, setQrCode, selectQrCode, selectTfaState, setTfaState, selectAfterSub, setAfterSub  } from '../redux-features/auth/authSlice';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import api from '../utils/Axios-config/Axios';
import './settings.css';
import { FetchActualUser, selectActualUser } from '../redux-features/friendship/friendshipSlice';

export const sock = io('http://localhost:4003', {
  withCredentials: true,
  transports: ['websocket'], 
  upgrade: false,
  autoConnect: false,
//   reconnection: false,
})

export function PersonalInformation () {
    const userRef = React.useRef<HTMLInputElement>(null)
    const [nickname, setNickname] = React.useState('')
    const [password, setPwd] = React.useState('')
    const [avatar, setAr] = React.useState('')
    const [email, setEmail] = React.useState('')
    const currUser = useAppSelector(selectCurrentUser)
    const [errMsg, setErrMsg] = React.useState('')
    const [confMsg, setConfMsg] = React.useState('')
    const errRef = React.useRef<HTMLInputElement>(null)
    const confRef = React.useRef<HTMLInputElement>(null)
    const dispatch = useAppDispatch();


    React.useEffect(() => {
        setErrMsg('')
    }, [nickname, password])
    // console.log('user actuel ', currUser)
    React.useEffect(() => {
        sock.connect()
        sock.on('connect', () => {

        })
        return () => {  // cleanUp function when component unmount
            sock.disconnect()
        }
      }, [])

      React.useEffect(() => {
        sock.on('UpdateInfoUser', (data: any) => {
            if (data.status === 403){
                setErrMsg(data.message);
            }
            else if (data !== null) {
                if (data.login) dispatch(setNick(data.login));
                if (data.email) dispatch(setMail(data.email));
                if (data.avatar) dispatch(setAvatar(data.avatar));
                setConfMsg('Changes registered')
            }
            else{
                console.log('la data est null')
            }
        })
        return () => {  // cleanUp function when component unmount
            // sock.disconnect()

        }
      }, [dispatch, setErrMsg])
    const [selectedImage, setSelectedImage] = React.useState<string>('');
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            // setSelectedImage(reader.result as string);
            const imageSrc = reader.result as string;
            setSelectedImage(imageSrc);
            setAr(imageSrc)
          };
          reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        fileInput?.click();
        };

    const handleSubmit: any = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try{
            sock.emit('changeProfile', {
                oldNick: currUser,
                login: nickname,
                pwd: password,
                mail: email,
                atr: avatar,
            })
        }
        catch (err: any) {
            if (!err)
                setErrMsg('No Server Response');
            else
             setErrMsg(err.data.message);
            if (errRef && errRef.current)
                errRef.current.focus();
        }

    }

    const content = (
        <Container sx={{
            width: '40%',
            height: '40%',
            p: 2,
        }}>
        <CssBaseline/>
            <Typography align='center' variant='h4' sx={{
                margin: '5%',
            }}>Personal Information</Typography>
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
                Save
                </Button>
                <Typography ref={confRef} className={confMsg ? "confmsg" : "offscreen"} aria-live="assertive">{confMsg}</Typography>
            </Box>
        </Container>
    )
    return content;
}

export function Security () {
    const user = useAppSelector(selectCurrentUser)
    const afterSub = useAppSelector(selectAfterSub)
    const twofa = useAppSelector(selectTfaState)
    const checked = useAppSelector(selectTfaAuth)
    const qrcode = useAppSelector(selectQrCode)
    let [TfaCode, setTfaCode] = React.useState('')
    const [confMsg, setConfMsg] = React.useState('')
    const confRef = React.useRef<HTMLInputElement>(null)
    const dispatch = useAppDispatch()

	React.useEffect(() => {
		dispatch(FetchActualUser())
        sock.connect()
        sock.on('connect', () => {

        })
        return () => {  // cleanUp function when component unmount
            sock.disconnect()
        }
      }, [])
    const actualUser = useAppSelector(selectActualUser)
    const tfa = async () => {
        await api
        .post("http://0.0.0.0:4001/auth/2fa/generate", actualUser)
        .then((res) => {dispatch(setQrCode(res.data));})
        .catch((e) => {console.log("error ", e)});
      }
    
      const cancelTfa = async () => {
        await api
        .post("http://0.0.0.0:4001/auth/2fa/cancel", {nickname: user})
        .then((res) => {})
        .catch((e) => {console.log("error ", e)});
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setTfaAuth(event.target.checked))
        if (checked === false){
            dispatch(setTfaState('Two Factor authentication is On'))
            tfa();
        }
        else {
            dispatch(setTfaState('Two Factor authentication is Off'))
            dispatch(setQrCode(''))
            setTfaCode('')
            cancelTfa();
        }
      };
      const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault(); // faire pareil que ci-dessus
        await api
        .post("http://0.0.0.0:4001/auth/2fa/turn-on", {TfaCode, actualUser})
        .then((res) => {
            setConfMsg('Two Factor authentication is now activated')
            setTfaCode('')
            dispatch(setQrCode(''))
            dispatch(setAfterSub(true))
        })
        .catch((e) => {console.log("error ", e)});
    }
    return (
        <>
            <h1>Two Factor Authentication </h1>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box sx={{
                    display: 'flex',

                }}>
                    <FormControlLabel control={<Switch
                        checked={checked}
                        onChange={handleChange}
                    />} label={twofa} sx={{
                    }}/>
                    <Popup 
                        // trigger={<div>TFA</div>}
                        position="right center" 
                        on="click"
                        closeOnDocumentClick
                        modal
                        nested    
                    >
                    </Popup>
                    <img
                    src={qrcode}
                    alt=""
                    className='omg'
                    />

                    {checked === true && afterSub === false && 
                        <>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                margin: '10px',
                                flex: 1,
                            }}>
                                <form id='form'>
                                    <input
                                        type="text"
                                        onChange={(e)=> setTfaCode(e.target.value)}
                                        placeholder="Tfa-Code"
                                        value={TfaCode}
                                        required
                                    />
                                </form>
                                <Button className="tfa-btn" type="submit" variant="contained" onClick={handleSubmit}>Send code</Button>
                                <p ref={confRef} className={confMsg ? "confmsg" : "offscreen"} aria-live="assertive">{confMsg}</p>
                            </Box>
                        </>

                    }   
                </Box>

            </Stack>
        </>
    )
}
