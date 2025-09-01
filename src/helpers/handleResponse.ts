// import type { AuthResponse } from '@supabase/supabase-js';

export const handleResponse = ({ data, error }: any) => {
	if (error) throw error;

	return data;
};
