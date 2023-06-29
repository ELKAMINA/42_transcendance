function is24HoursApart(currentTime: Date, previousTime: Date): boolean {
	const currentTimestamp: number = currentTime.getTime();
	const previousTimestamp: number = previousTime.getTime();
	const twentyFourHoursInMilliseconds: number = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
	return currentTimestamp - previousTimestamp >= twentyFourHoursInMilliseconds;
  }