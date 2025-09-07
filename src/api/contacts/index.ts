import { supabase } from '@/api/supabase';
import { handleResponse } from '@/helpers/handleResponse.ts';

import type { Contact, UpdateContactPayload } from '@/types/Contacts.ts';

export const createContact = async (data: UpdateContactPayload) => {
	const response = await supabase.from('contacts').insert([data]);

	return handleResponse<typeof response.data>(response);
};

export const getAllContacts = async (): Promise<Contact[]> => {
	const response = await supabase.from('contacts').select('*');

	return handleResponse<Contact[] | null>(response) ?? [];
};
//
// export const updateTask = async (data: UpdateTaskPayload) => {
// 	const response = await supabase
// 		.from('tasks')
// 		.update(data)
// 		.eq('id', data.id)
// 		.select()
// 		.single();
//
// 	return handleResponse(response);
// };
//
export const deleteContacts = async (ids: string[]) => {
	const response = await supabase.from('contacts').delete().in('id', ids);

	return handleResponse(response);
};
