import type { AuthResponse } from '@supabase/supabase-js';

export const handleResponse = ({ data, error }: AuthResponse) => {
	if (error) throw error;

	return data;
};
