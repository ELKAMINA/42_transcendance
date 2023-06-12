import React from 'react'
import "./createChannel.css"
interface CreateChannelProps {
	trigger: boolean;
	setTrigger: (value: boolean) => void;
	children?: React.ReactNode;
}
  
function CreateChannel(props : CreateChannelProps) {
  return (props.trigger) ? (
	<div className='create-channel-popup'>
	  <div className='create-channel-popup-inner'>
		<button className='close-btn' onClick={() => props.setTrigger(false)}>close</button>
		<div>
			<form className='create-channel-form'>
				<div className='form-banner'>
					<h1>CREATE CHANNEL</h1>
					<br></br>
				</div>
				<div className='entry1'>
					<label className='form-channel-name' htmlFor='channelName'>channel name</label>
					<br></br>
					<input className='inputForm' type='text' name='channelName'/>
				</div>
				<br></br>
				<div className='entry1'>
					<label className='form-channel-name' htmlFor='addUsers'>add users</label>
					<br></br>
					<input className='inputForm' type='text' name='addUsers'/>
				</div>
			</form>
		</div>
		{props.children}
	  </div>
	</div>
  ) : null;
}

export default CreateChannel
