import { supabase } from '@/api/supabase';
import { handleResponse } from '@/helpers/handleResponse.ts';

import type { CreateTaskPayload, Task } from '@/types/tasks';

export const createTask = async (data: CreateTaskPayload) => {
	const response = await supabase.from('tasks').insert([data]);

	return handleResponse(response);
};

export const getAllTasks = async (): Promise<Task[]> => {
	const response = await supabase.from('tasks').select('*');

	return handleResponse(response);
};

export const updateTask = async (data: CreateTaskPayload) => {
	const response = await supabase
		.from('tasks')
		.update(data)
		.eq('id', data.id)
		.select()
		.single();

	return handleResponse(response);
};

export const deleteTask = async (id: string) => {
	const response = await supabase.from('tasks').delete().eq('id', id);

	return handleResponse(response);
};
