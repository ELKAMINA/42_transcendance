import React from 'react'
import FriendshipComponent from '../../components/AllFriendship'
import Navbar from '../../components/NavBar';
import './Friendship.css';

function FriendshipContainer() {
    const itemList = ['Suggestions', 'Requests', 'Friends'];
	const currentRoute = window.location.pathname;
  return (
    <div>
        <Navbar currentRoute={ currentRoute }/>
        <FriendshipComponent items= {itemList}/>
    </div>
  )
}

export default FriendshipContainer
