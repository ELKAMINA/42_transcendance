
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
import Cookies from 'js-cookie';
import { setAvatar } from '../redux-features/auth/authSlice';
import { selectCurrentUser } from '../redux-features/auth/authSlice';


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
    const errRef = React.useRef<HTMLInputElement>(null)


    React.useEffect(() => {
        setErrMsg('')
    }, [nickname, password])
    console.log('user actuel ', currUser)
    const dispatch = useDispatch()
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

    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            // setSelectedImage(reader.result as string);
            const imageSrc = reader.result as string;
            setSelectedImage(imageSrc);
            // dispatch(setAvatar(imageSrc));
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
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        </Stack>
    )
    return content;
}

export function Security () {
    return (
        <>
        </>
    )
}
