export interface UpdateContactPayload {
	id?: string;
	first_name: string;
	last_name: string;
	email?: string;
	phone?: string;
	notes?: string;
	user_id?: string | null;
}

export interface Contact {
	created_at: string;
	email?: string;
	first_name: string;
	id: string;
	last_name: string;
	notes: string;
	phone: string;
	user_id: string;
}
