export interface UpdateContactPayload {
	id?: string;
	first_name: string;
	last_name: string;
	email?: string;
	phone?: string;
	notes?: string;
	user_id?: string | null;
}
