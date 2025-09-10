export interface UpdateContactPayload {
	email?: string;
	first_name: string;
	id?: string;
	last_name?: string;
	notes?: string;
	user_id?: string;
	address?: string;
	birthday?: string;
	facebook?: string;
	instagram?: string;
	phones?: string[] | [];
	telegram?: string;
	whatsapp?: string;
	favourite?: boolean;
}

export interface Contact {
	created_at: string;
	email?: string;
	first_name: string;
	id: string;
	last_name: string;
	notes: string;
	user_id: string;
	address: string;
	birthday: string;
	facebook: string;
	instagram: string;
	phones: string[] | [];
	telegram: string;
	whatsapp: string;
	favourite: boolean;
	social: string[];
}
