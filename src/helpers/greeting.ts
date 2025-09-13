// Helper to determine greeting based on local time
// Exported as a small pure function so it can be reused and tested.
// Returns an i18n key like 'greeting.morning' | 'greeting.afternoon' | 'greeting.evening' | 'greeting.night'
export type GreetingKey = 'greeting.morning' | 'greeting.afternoon' | 'greeting.evening' | 'greeting.night';

export function getGreetingKey(date: Date = new Date()): GreetingKey {
	const hour = date.getHours(); // 0-23 local time
	if (hour >= 5 && hour < 12) return 'greeting.morning';
	if (hour >= 12 && hour < 17) return 'greeting.afternoon';
	if (hour >= 17 && hour < 22) return 'greeting.evening';
	return 'greeting.night';
}
