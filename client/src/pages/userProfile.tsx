import React, { useState } from 'react';
import { useEffect } from 'react';
import api from '../utils/Axios-config/Axios';
import { useLocation } from 'react-router-dom';
import  UserProfileHeader  from '../components/UserProfile/userProfile-header';
import { store } from '../app/store';
import { current } from '@reduxjs/toolkit';
import Navbar from '../components/NavBar';
import './userProfile.css';
import ProfileInfo from '../containers/ProfileInfo/ProfileInfo';

const UserProfile = () => {
  const location = useLocation();
  const currentRoute = window.location.pathname;
  const [isMyfriend, setMyFriend] = useState({
    isMyfriend: false,
    myBlockedFriend: false,
    thoseWhoBlockedMe: false
  })
  const queryParams = new URLSearchParams(location.search);
  console.log('query paramq ', queryParams.values());
  const name = queryParams.get('login');
  const status = queryParams.get('status');
  const friendship = async () => await api.post('http://localhost:4001/friendship/ismyfriend', {me: store.getState().persistedReducer.auth.nickname, him: name })
  .then((res) => {
    console.log("la data pour savoir si firne ou non", res)
    setMyFriend(res.data);
  })
  .catch((e) => console.log('eroooor ', e));

    useEffect( () => {
      friendship();
    }, [])

  return (
    <div className='userprofile-container'>
      <div className='userprofile-header'>
        <Navbar currentRoute={currentRoute}/>
      </div>
      <div className='userprofile-middle'>
        <UserProfileHeader name={name} status={status} friendship={isMyfriend}/>
        <ProfileInfo/>
      </div>
      <div className='userprofile-infos'>

      </div>
    </div>
  )
}

export default UserProfile;
