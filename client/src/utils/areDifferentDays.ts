function areDifferentDays(currentDate: Date, previousDate: Date): boolean {

	if (typeof currentDate === 'string') {
		currentDate = new Date(currentDate);
	}
	
	if (typeof previousDate === 'string') {
		previousDate = new Date(previousDate);
	}

	const startOfCurrentDay = new Date(
	  currentDate.getFullYear(),
	  currentDate.getMonth(),
	  currentDate.getDate(),
	  0, 0, 0, 0
	);
	
	const startOfPreviousDay = new Date(
	  previousDate.getFullYear(),
	  previousDate.getMonth(),
	  previousDate.getDate(),
	  0, 0, 0, 0
	);
  
	return startOfCurrentDay.getTime() !== startOfPreviousDay.getTime();
  }

  export default areDifferentDays

// function is24HoursApart(currentTime: Date | string, previousTime: Date | string): boolean {
// 	if (typeof currentTime === 'string') {
// 	  currentTime = new Date(currentTime);
// 	}
  
// 	if (typeof previousTime === 'string') {
// 	  previousTime = new Date(previousTime);
// 	}
  
// 	const currentTimestamp: number = currentTime.getTime();
// 	const previousTimestamp: number = previousTime.getTime();
// 	const twentyFourHoursInMilliseconds: number = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
// 	return currentTimestamp - previousTimestamp >= twentyFourHoursInMilliseconds;
//   }
  
//   export default is24HoursApart;
  