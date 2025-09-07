export interface UpdateContactPayload {
	email?: string;
	first_name: string;
	id?: string;
	last_name?: string;
	notes?: string;
	user_id?: string;
	address?: null;
	birthday?: null;
	facebook?: null;
	instagram?: null;
	phones?: string[] | [];
	telegram?: null;
	whatsapp?: null;
}

export interface Contact {
	created_at: string;
	email?: string;
	first_name: string;
	id: string;
	last_name: string;
	notes: string;
	user_id: string;
	address: null;
	birthday: null;
	facebook: null;
	instagram: null;
	phones: string[] | [];
	telegram: null;
	whatsapp: null;
}
