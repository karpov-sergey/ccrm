import { supabase } from '@/api/supabase';
import { handleResponse } from '@/helpers/handleResponse.ts';

export const signUp = async (email: string, password: string) => {
	const response = await supabase.auth.signUp({
		email,
		password,
	});

	return handleResponse(response);
};

export const login = async (email: string, password: string) => {
	const response = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	return handleResponse(response);
};

export const logout = async () => {
	await supabase.auth.signOut();
};

export const getSession = async () => {
	const { data } = await supabase.auth.getSession();

	return data;
};
