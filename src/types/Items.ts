export interface CreateItemPayload {
	title: string;
	user_id: string;
	images: string[];
	id?: string;
}

export interface Item {
	title: string;
	user_id: string;
	images: string[];
	id: string;
}
