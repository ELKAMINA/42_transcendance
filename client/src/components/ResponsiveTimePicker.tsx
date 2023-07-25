import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import { Box } from '@mui/material';

export type ResponsiveTimePickerProps = {
	handleSelectedTime : (time : string) => void;
	label : string
}

export default function ResponsiveTimePicker({handleSelectedTime, label} : ResponsiveTimePickerProps) {

	function handleChange(value : any) {
		// Convert the 'value' object to a dayjs instance
		const selectedTime = dayjs(value);

		// Extract the hour and minute from the selected time
		// const hour = selectedTime.hour();
		// const minute = selectedTime.minute();
	
		// Format the time as HH:mm (24-hour format)
		const formattedTime = selectedTime.format('HH:mm');
		// console.log('formattedTime', formattedTime)
		handleSelectedTime(formattedTime);
	}

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box sx={{backgroundColor: 'transparent', marginLeft: '30%', marginRight: '3%'}}>
				<TimePicker
					defaultValue={'select time'}
					onAccept={handleChange}
					label={label}
					viewRenderers={{
						hours: renderTimeViewClock,
						minutes: renderTimeViewClock,
						seconds: renderTimeViewClock,
					}}
					sx={{
						width: '100%',
						PaddingRight: '0',
						backgroundColor: 'transparent',
						'& .MuiInputBase-input': { // This targets the input text
							color: '#021a30',
							backgroundColor: 'transparent',
							boxShadow: 'none',
							padding: '8px',
						},
					}}
				/>
			</Box>
		</LocalizationProvider>
	);
}
