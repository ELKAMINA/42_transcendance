import React from 'react'
import PermanentSidebar from '../../components/AllFriendship'
import Navbar from '../../components/NavBar';
import './Friendship.css';

function FriendshipContainer() {
    const itemList = ['Suggestions', 'Requests', 'Friends'];
	const currentRoute = window.location.pathname;
  return (
    <div>
        <Navbar currentRoute={ currentRoute }/>
        <PermanentSidebar items= {itemList}/>
    </div>
  )
}

export default FriendshipContainer
