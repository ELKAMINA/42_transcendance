import React from "react";
import { useDispatch } from "react-redux";
import { Box, Checkbox, Divider, FormControlLabel, FormGroup, Stack } from "@mui/material";

import PasswordField from "../../components/PasswordField";
import { addChannelType, addPassword, isProtectedByPassword } from "../../redux-features/chat/createChannel/channelTypeSlice";

function  CreateType() {
	const dispatch = useDispatch();
	
	// watch the state of the checkboxes
	const [checkedPublic, setCheckedPublic] = React.useState(true);
	const [checkedPrivate, setCheckedPrivate] = React.useState(false);
	const [checkedProtected, setCheckedProtected] = React.useState(false);

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
	<Box className='form-channel-type'>
		<Stack direction={'column'} spacing={2} alignItems={'start'}>
			<Divider />
			<label className='create-channel-label' htmlFor='channelType'>choose channel type</label>
			<FormGroup>
				<FormControlLabel control={<Checkbox checked={checkedPublic} onChange={handlePublic} name="public" />} label="public"/>
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