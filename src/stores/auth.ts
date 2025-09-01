import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';

import {
	signUp,
	getSession,
	logout,
	login,
	updateUser,
	getUser,
} from '@/api/auth';

import type { User } from '@supabase/supabase-js';
import type { UserPayload } from '@/types/User.ts';

interface AuthState {
	token: string | null;
	user: User | null;
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		token: null,
		user: null,
	}),

	getters: {
		isAuthorized(): boolean {
			return !!this.token;
		},
		currentUser(): User | null {
			return this.user;
		},
	},

	actions: {
		async signUp(email: string, password: string) {
			try {
				const data = await signUp(email, password);

				this.user = data.user ?? null;
				this.token = data.session?.access_token ?? null;
			} catch (error: any) {
				toast.error(error.message);
			}
		},

		async getSession() {
			try {
				const data = await getSession();
				const session = data.session ?? null;

				this.user = session?.user ?? null;
				this.token = session?.access_token ?? null;
			} catch (error) {}
		},

		async logout() {
			this.token = null;

			await logout();
		},

		async login(email: string, password: string): Promise<void> {
			try {
				const data = await login(email, password);
				const session = data.session ?? null;

				this.user = session?.user ?? null;
				this.token = session?.access_token ?? null;
			} catch (error: any) {
				toast.error(error.message);
			}
		},

		async updateUser(userData: UserPayload) {
			try {
				const data = await updateUser(userData);

				this.user = data.user;
			} catch (error: any) {
				toast.error(error.message);
			}
		},

		async getCurrentUser() {
			try {
				const data = await getUser();

				this.user = data.user ?? null;
			} catch (error: any) {
				toast.error(error.message);
			}
		},
	},
});
