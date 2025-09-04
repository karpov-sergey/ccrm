import { supabase } from '@/api/supabase';
import { handleResponse } from '@/helpers/handleResponse.ts';

export const createTask = async (data: any) => {
	const response = await supabase.from('tasks').insert([data]);

	return handleResponse(response);
};

export const getAllTasks = async () => {
	const response = await supabase.from('tasks').select('*');

	return handleResponse(response);
};
