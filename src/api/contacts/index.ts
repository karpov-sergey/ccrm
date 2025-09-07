import { supabase } from '@/api/supabase';
import { handleResponse } from '@/helpers/handleResponse.ts';

import type { Contact, UpdateContactPayload } from '@/types/Contacts.ts';

export const createContact = async (data: UpdateContactPayload) => {
	const response = await supabase.from('contacts').insert([data]);

	return handleResponse(response);
};

export const getAllContacts = async (): Promise<Contact[]> => {
	const response = await supabase.from('contacts').select('*');

	return handleResponse(response);
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
// export const deleteTask = async (id: string) => {
// 	const response = await supabase.from('tasks').delete().eq('id', id);
//
// 	return handleResponse(response);
// };
