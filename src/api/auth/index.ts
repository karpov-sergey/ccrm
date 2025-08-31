import { supabase } from '@/api/supabase';
import { handleResponse } from '@/helpers/handleResponse.ts';

export const signUp = async (email: string, password: string) => {
	const response = await supabase.auth.signUp({
		email,
		password,
	});

	return handleResponse(response);
};

export const signIn = async (email: string, password: string) => {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) console.error(error);
	else console.log('Успешный вход:', data);
};

export const signOut = async () => {
	await supabase.auth.signOut();
};

export const getSession = async () => {
	console.log('sess');
	const { data } = await supabase.auth.getSession();

	return data;
};
