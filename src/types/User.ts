import type { User as SupabaseUser } from '@supabase/supabase-js';

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

export interface User extends SupabaseUser {
	currency?: string;
	language?: string;
	user_metadata?: {
		currency: string;
		email: string;
		email_verified: boolean;
		firstName: string;
		language: string;
		lastName: string;
		phone_verified: boolean;
		position: string;
		sub: string;
	};
}
