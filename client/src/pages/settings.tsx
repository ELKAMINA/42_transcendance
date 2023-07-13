
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../utils/redux-hooks'; // These typed hooks are different from the authSlice, because, as we're using redux thunks inside slices, we need specific typing for typescript
import { io } from 'socket.io-client';
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
        //   console.log("la socket id ", sock.id);
          // dispatch(updateSocketId(socket.id));
        })
        return () => {  // cleanUp function when component unmount
          console.log('Settings - Unregistering events...');
        //   sock.disconnect();
          // dispatch(updateSocketId(''));
          // socket.off('denyFriend');
          // socket.off('friendAdded')
          // socket.off('connect');
        }
      }, [])

      React.useEffect(() => {
        sock.on('UpdateInfoUser', (data: any) => {
            if (data.status === 403){
                setErrMsg(data.message);
            }
            else {
                if (data.login) dispatch(setNick(data.login));
                if (data.email) dispatch(setMail(data.email));
                if (data.avatar) dispatch(setAvatar(data.avatar));
                setConfMsg('Changes registered')
            }
        })
        return () => {  // cleanUp function when component unmount
          console.log('Settings - Unregistering events...');
        //   sock.disconnect();
          // dispatch(updateSocketId(''));
          // socket.off('denyFriend');
          // socket.off('friendAdded')
          // socket.off('connect');
        }
      }, [dispatch, setErrMsg])
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

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

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

    const handleButtonClick = () => {
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        fileInput?.click();
    
    };

    const content = (
        <Stack sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            margin: 10,
            flex: 1,
        }}>
            <h2>Personal Information</h2>
            <form id='form'>
                <Stack spacing={2} sx={{
                    margin: '10px',
                    width: '50vw',
                }}>
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
                    <input 
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        required
                    />

                </Stack>
            </form>
            <input
                id="image-upload"
                type="file" accept="image/*" onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
            <IconButton onClick={handleButtonClick} sx={{
                fontSize: '15px'
            }}> Upload your avatar </IconButton>
            {selectedImage && <Avatar src={selectedImage}/>}
            <br>
            </br>
            <Button className="mui-btn" type="submit" variant="contained" onClick={handleSubmit}>Save</Button>
            <p ref={confRef} className={confMsg ? "confmsg" : "offscreen"} aria-live="assertive">{confMsg}</p>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        </Stack>
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
    const navigate = useNavigate();
    const [confMsg, setConfMsg] = React.useState('')
    const confRef = React.useRef<HTMLInputElement>(null)
    const dispatch = useAppDispatch()

    const tfa = async () => {
        await api
        .post("http://0.0.0.0:4001/auth/2fa/generate")
        .then((res) => {dispatch(setQrCode(res.data));})
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
        }
      };
      const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault(); // faire pareil que ci-dessus
        await api
        .post("http://0.0.0.0:4001/auth/2fa/turn-on", {TfaCode})
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
                        //   inputProps={{ 'aria-label': 'controlled' }}
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
