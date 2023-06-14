import { useEffect } from 'react';
import { Button } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../utils/redux-hooks'; // These typed hooks are different from the authSlice, because, as we're using redux thunks inside slices, we need specific typing for typescript

import Navbar from '../components/NavBar';
import { useSelector } from 'react-redux';
import { Login } from '@mui/icons-material';
import { FriendSuggestion } from '../components/FriendSuggestion';
import { selectCurrentAvatar, selectCurrentUser } from '../redux-features/auth/authSlice';
import { FetchAllUsers } from '../redux-features/friendship/friendshipSlice';
import { selectSuggestions } from '../redux-features/friendship/friendshipSlice';

function Friendship () {
  const currentRoute = window.location.pathname;
  const dispatch = useAppDispatch();
  const currUser = useSelector(selectCurrentUser)
  const avatar = useSelector(selectCurrentAvatar)
  useEffect(() => {
    dispatch(FetchAllUsers());
  }, []);
  const suggestions = useAppSelector(selectSuggestions)
  
  const content = (
    <div>
      <Navbar currentRoute={ currentRoute }/>
      <h1> Get all user from Database </h1>
      {suggestions.map((sugg) => <FriendSuggestion login={sugg.login} avatar={sugg.avatar}/>)}
      
      
    </div>
  )
  return content;
}

export default Friendship;