import { useDispatch, useSelector } from "react-redux";
import "./createChannel.css"
import { RootState } from "../../app/store";

function CreateName() {
	const channels = useSelector((state: RootState) => state.channels);

	const dispatch = useDispatch();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		// FOR DEBUG
		console.log("new name is = ", e.target.value);
		
		const input = e.target.value;
		if (channels.find(channel => channel.name === input))
			alert("name is taken, please choose a different one");
		else {
			dispatch({
				type: 'channelName/changeChannelName',
				payload: input, 
			});
		}
	}

	return (
	<div className='entry1'>
		<label className='form-channel-name' htmlFor='channelName'>channel name</label>
		<br></br>
		<input 
			className='inputForm' 
			type='text' 
			name='channelName'
			onChange={handleChange}
		/>
	</div>
	);
}

export default CreateName