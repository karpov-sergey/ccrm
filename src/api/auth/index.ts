import { supabase } from '@/api/supabase';
import { handleResponse } from '@/helpers/handleResponse.ts';

import type { SignupPayload, UserPayload } from '@/types/User.ts';

export const signUp = async (data: SignupPayload) => {
	const response = await supabase.auth.signUp(data);

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

export const getUser = async () => {
	const response = await supabase.auth.getUser();

	return handleResponse(response);
};

export const updateUser = async (userData: UserPayload) => {
	const response = await supabase.auth.updateUser({
		data: userData,
	});

	return handleResponse(response);
};

export const changePassword = async (password: string) => {
	const response = await supabase.auth.updateUser({
		password: password,
	});

	return handleResponse(response);
};
