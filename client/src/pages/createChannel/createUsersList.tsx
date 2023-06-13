import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { userList } from "../../data/userList";
import React from "react";

function CreateUsersList() {
	const channelUsersList = useSelector((state : RootState) => state.channelUser);

	const dispatch = useDispatch();

	function handleChannelUsersList(e: React.ChangeEvent<HTMLSelectElement>) {
		dispatch({
			type: "channelUser/addChannelUser",
			payload: userList.find(user => user.name === e.target.value),
		})
	};

	return (
	<div className='entry1'>
		<label className='form-channel-name' htmlFor='addUsers'>add users</label>
		<br></br>
		<select
		name = "channelUsersList"
		id = "channelUsers-select"
		onChange={handleChannelUsersList}
		>
			<option value="default">add users to channel</option>
			{
				userList.map((user, index) => <option key={`${user.name}-${index}`}>{user.name}</option>)
			}
		</select>
		<div>
			{
				channelUsersList.map((user, index) => (
					<React.Fragment key={`${user.name}-${index}`}>
						{index > 0 && <span>&nbsp;&nbsp;&nbsp;-&nbsp;</span>} {/* Display the separator with spaces for all users except the first one */}
						{user.name}
					</React.Fragment>
				)
				)
			}
		</div>
	</div>
	)
}

export default CreateUsersList