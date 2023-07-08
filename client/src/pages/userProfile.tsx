import React, { useState } from 'react';
import { useEffect } from 'react';
import api from '../utils/Axios-config/Axios';
import { useLocation } from 'react-router-dom';
import  UserProfileHeader  from '../components/UserProfile/userProfile-header';
import { store } from '../app/store';
import { current } from '@reduxjs/toolkit';
import Navbar from '../components/NavBar';
import './userProfile.css';
import ProfileInfo from '../components/UserProfile/Statistics/ProfileInfo';


function transformData(queryParams: URLSearchParams) {
  const obj: Record<string, string> = {};

  for (const [key, value] of queryParams.entries()) {
    obj[key] = value;
  }
  return obj;
}

const UserProfile = () => {
  const location = useLocation();
  const currentRoute = window.location.pathname;
  const [isMyfriend, setMyFriend] = useState({
    isMyfriend: false,
    myBlockedFriend: false,
    thoseWhoBlockedMe: false
  })
  const userToStalk = transformData(new URLSearchParams(location.search));

  const friendship = async () => await api.post('http://localhost:4001/friendship/ismyfriend', {me: store.getState().persistedReducer.auth.nickname, him: userToStalk.login })
  .then((res) => {
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
        <UserProfileHeader name={userToStalk.login} status={userToStalk.status} friendship={isMyfriend}/>
        <ProfileInfo interestProfile={userToStalk}/>
      </div>
      <div className='userprofile-infos'>

      </div>
    </div>
  )
}

export default UserProfile;
