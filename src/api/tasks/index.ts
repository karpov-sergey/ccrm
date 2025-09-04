import { supabase } from '@/api/supabase';
import { handleResponse } from '@/helpers/handleResponse.ts';

export const createTask = async (data: any) => {
	const response = await supabase.from('tasks').insert([data]);

	return handleResponse(response);
};
