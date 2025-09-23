import { supabase } from '@/api/supabase';
import { handleResponse } from '@/helpers/handleResponse.ts';

import type { CreateItemPayload, Item } from '@/types/Items.ts';

export const createItem = async (data: CreateItemPayload) => {
	const response = await supabase.from('items').insert([data]);

	return handleResponse<typeof response.data>(response);
};

export const getAllItems = async (): Promise<Item[]> => {
	const response = await supabase.from('items').select('*');

	return handleResponse<Item[] | null>(response) ?? [];
};
