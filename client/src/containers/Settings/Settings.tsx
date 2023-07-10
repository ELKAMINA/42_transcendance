import React from 'react'
import SettingsComponent from '../../components/UserSettings/UserSetting';
import Navbar from '../../components/NavBar';
import './Settings.css';

function SettingsContainer() {
    const itemList = ['Personal Information', 'Security'];
	const currentRoute = window.location.pathname;
  return (
    <div>
        <Navbar currentRoute={ currentRoute }/>
        <SettingsComponent items= {itemList}/>
    </div>
  )
}

export default SettingsContainer
