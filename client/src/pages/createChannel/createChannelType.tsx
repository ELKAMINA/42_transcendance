import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import React from "react";
import { addChannelType, addPassword, isProtectedByPassword } from "../../features/chat/channelTypeSlice";
import PasswordField from "../../components/PasswordField";

function  CreateType() {
	const channelType = useSelector((state: RootState) => state.persistedReducer.channelType);
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

	const handlePwd = (e: React.ChangeEvent<HTMLInputElement>) => {

		if (checkedProtected === true)
			dispatch(addPassword(e.target.value))		
	}

	return (
	<div className='entry1'>
		<label className='form-channel-name' htmlFor='channelType'>choose channel type</label>
		<br></br>
		<FormGroup>
			<FormControlLabel control={<Checkbox checked={checkedPublic} onChange={handlePublic} name="public" />} label="public"/>
			<FormControlLabel control={<Checkbox checked={checkedPrivate} onChange={handlePrivate} name="private" />} label="private" />
			<FormControlLabel control={<Checkbox checked={checkedProtected} onChange={handleProtected} name="protected_by_password" />} label="protected by password" />
			{checkedProtected && (
			<PasswordField />
			)}
		</FormGroup>
	</div>
	);
}

export default CreateType