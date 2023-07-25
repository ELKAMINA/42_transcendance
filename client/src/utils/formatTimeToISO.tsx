import moment from 'moment-timezone';


export default function formatTimeToISO(time: string, timeZone: string) {
	// console.log('time = ', time);
	
	// Get the current date as a JavaScript Date object
	const currentDate = new Date();
	
	// Extract hours and minutes from the provided time string
	const [hours, minutes] = time.split(':').map(Number);
	
	// Set the hours and minutes to the currentDate object
	currentDate.setHours(hours);
	currentDate.setMinutes(minutes);
	
	// Convert the current date to the specified time zone using moment-timezone
	const timeZoneDate = moment.tz(currentDate, timeZone);
	
	// Format the timeZoneDate to 'YYYY-MM-DDTHH:mm:ss.sssZ' (ISO 8601 format)
	const isoTime = timeZoneDate.format();
	
	// console.log('isoTime = ', isoTime);
	return isoTime;
}