import type { User as SupabaseUser } from '@supabase/supabase-js';

// Allow flexible metadata updates while keeping known keys typed
export interface UserPayload {
	firstName?: string;
	lastName?: string;
	currency?: string;
	language?: string;
	timeFormat?: '12h' | '24h';
	// Additional custom metadata fields
	[key: string]: unknown;
}

export interface SignupPayload {
	options: {
		data: UserPayload;
	};
	email: string;
	password: string;
}

export interface UserMetadata {
	currency?: string;
	email?: string;
	email_verified?: boolean;
	firstName?: string;
	language?: string;
	lastName?: string;
	timeFormat?: '12h' | '24h';
	phone_verified?: boolean;
	position?: string;
	sub?: string;
	[key: string]: unknown;
}

export interface User extends SupabaseUser {
	currency?: string;
	timeFormat?: '12h' | '24h';
	user_metadata: UserMetadata;
}
