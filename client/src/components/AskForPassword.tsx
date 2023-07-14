import React from 'react'
import AlertDialogSlide from './AlertDialogSlide';
import EnterPassword from './EnterPassword';
import FullScreenAlert from './FullScreenAlert';
import { Box } from '@mui/material';
import api from '../utils/Axios-config/Axios';

type elementObj = {
	name: string;
	key?: string;
}

type AskForPasswordProps = {
	AlertDialogSlideOpen : boolean;
	setAlertDialogSlideOpen : (isOpen: boolean) => void;
	getSelectedItem : (pwd: string) => void;
	element : elementObj; // element with a key property

}

function AskForPassword({element, AlertDialogSlideOpen, setAlertDialogSlideOpen, getSelectedItem} : AskForPasswordProps) {

	// const [AlertDialogSlideOpen, setAlertDialogSlideOpen] = React.useState(false);
	const [alertError, setAlertError] = React.useState<boolean>(false);
	const [alertSuccess, setAlertSuccess] = React.useState<boolean>(false);
	const [isPasswordCorrect, setIsPasswordCorrect] = React.useState<boolean>(false); 

	async function checkPassword(pwd : string) {
		if (element.key) {
			try {
				await api
					.post('http://localhost:4001/channel/checkPwd', {pwd : pwd, obj : {name : element.name}})
					.then((response) => {
						setIsPasswordCorrect(response.data)
					})
					.catch((error) => console.log('caught error while checking password : ', error));
			} catch (error) {
				console.error('Error occurred while verifying password:', error);
			}
		} else {
			console.log("Something went wrong... no need for password here!")
		}
	}

	function handlepwd(pwd: string) {
		checkPassword(pwd);
	}

	// handle what happens when the passwordfield window closes
	const handleClose = () => {
		if (isPasswordCorrect === true) {
			getSelectedItem(element.name);
			setAlertSuccess(true);
		} else {
			setAlertError(true);
		}
		setAlertDialogSlideOpen(false);
 	};

	const handleCloseAlert = () => {
		setAlertError(false);
		setAlertSuccess(false);
	}

	return (
		<div>
			<AlertDialogSlide 
				handleClose={handleClose}
				open={AlertDialogSlideOpen}
				dialogContent={<EnterPassword handlepwd={handlepwd} passwordFieldId={'passwordfield'} isPwdCorrect={isPasswordCorrect} />} />
			<Box>
				{ alertError &&
					<FullScreenAlert severity='error' alertTitle='Error' normalTxt='incorrect password --' 
						strongTxt='you may not enter this channel.' open={alertError} handleClose={handleCloseAlert}/>
				}
				{ alertSuccess &&
					<FullScreenAlert severity='success' alertTitle='Success' normalTxt='password is correct! --' 
						strongTxt='you may enter this channel.' open={alertSuccess} handleClose={handleCloseAlert}/>
				}
			</Box>
		</div>
	)
}

export default AskForPassword
