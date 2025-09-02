export interface UserPayload {
	firstName: string;
	lastName: string;
}

export interface SignupPayload {
	options: {
		data: {
			firstName: string;
			lastName: string;
		};
	};
	email: string;
	password: string;
}
