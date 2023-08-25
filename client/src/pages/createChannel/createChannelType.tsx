import React from "react";
import { useDispatch } from "react-redux";
import { Box, Checkbox, Divider, FormControlLabel, FormGroup, Stack, Typography } from "@mui/material";

import PasswordField from "../../components/PasswordField";
import { addChannelType, addPassword, isProtectedByPassword } from "../../redux-features/chat/createChannel/channelTypeSlice";

/*** ISSUE 110 ***/
// HANDLE ERROR ON WHOLE createChannel COMPONENT
import { useEffect } from "react";
import {
	setTypeErrorState,
} from "../../redux-features/chat/createChannel/createChannelErrorSlice";

function  CreateType() {
	const dispatch = useDispatch();
	
	// watch the state of the checkboxes
	const [checkedPublic, setCheckedPublic] = React.useState(true);
	const [checkedPrivate, setCheckedPrivate] = React.useState(false);
	const [checkedProtected, setCheckedProtected] = React.useState(false);
	/*** ISSUE 137 ***/
	const [isTypeError, setIsTypeError] = React.useState(false);

	/*** ISSUE 110 ***/
	/*** ISSUE 137 ***/
	useEffect(() => {
		if (checkedPublic === false && checkedPrivate === false) {
			setIsTypeError(true);
			dispatch(setTypeErrorState(true));
		} else {
			setIsTypeError(false);
			dispatch(setTypeErrorState(false));
		}
	}, [checkedPublic, checkedPrivate, checkedProtected])

	const handlePublic = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheckedPublic(e.target.checked);
		
		if (checkedPrivate === true)
			setCheckedPrivate(false);
		
		if (e.target.checked === true)		
			dispatch(addChannelType(e.target.name))
	}

	const handlePrivate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheckedPrivate(e.target.checked);
		
		if (checkedPublic === true)
			setCheckedPublic(false);
		
		if (e.target.checked === true)		
			dispatch(addChannelType(e.target.name))
	}

	const handleProtected = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheckedProtected(e.target.checked);

		dispatch(isProtectedByPassword(e.target.checked))
	}

	const handlePwd = (pwd : string) => {
		if (checkedProtected === true)
			dispatch(addPassword(pwd))
	}

	return (
	<Box className='form-channel-type' color={isTypeError === true ? "rgb(200, 91, 86)" : "black"}>
		<Stack direction={'column'} spacing={2} alignItems={'start'}>
			<Divider />
			{/* <label className='create-channel-label' htmlFor='channelType'>choose channel type</label> */}
			<Typography variant="h5" gutterBottom>
        		Choose channel type
      		</Typography>
			{isTypeError && <Typography variant="caption" gutterBottom>
        		Error: One type 'Public' or 'Private' must be selected
      		</Typography>}
			<FormGroup id={'channelType'}>
				<FormControlLabel control={<Checkbox checked={checkedPublic} onChange={handlePublic} name="public"/>} label="public"/>
				<FormControlLabel control={<Checkbox checked={checkedPrivate} onChange={handlePrivate} name="private" />} label="private" />
				<FormControlLabel control={<Checkbox checked={checkedProtected} onChange={handleProtected} name="protected_by_password" />} label="protected by password" />
				{checkedProtected && (
					<PasswordField handlePwd={handlePwd} passwordFieldId='createChannelPwd' isPwdCorrect={true}/>
				)}
			</FormGroup>
		</Stack>
	</Box>
	);
}

export default CreateType