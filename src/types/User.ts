export interface UserPayload {
	firstName: string;
	lastName: string;
	currency?: string;
	language?: string;
}

export interface SignupPayload {
	options: {
		data: {
			firstName: string;
			lastName: string;
			currency?: string;
			language?: string;
		};
	};
	email: string;
	password: string;
}
