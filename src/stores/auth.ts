import { defineStore } from 'pinia';

import { signUp, getSession } from '@/api/auth';

import { toast } from 'vue-sonner';
import type { User } from '@supabase/supabase-js';

interface AuthState {
	token: string | undefined;
	user: User | null;
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		token: '',
		user: null,
	}),

	getters: {
		isAuthorized(): boolean {
			return !!this.token;
		},
	},

	actions: {
		async signUp(email: string, password: string): Promise<void> {
			try {
				const data = await signUp(email, password);

				this.user = data.user;
				this.token = data.session?.refresh_token;
			} catch (error: any) {
				toast.error(error.message);

				return;
			}
		},
		async getSession() {
			try {
				const data = await getSession();

				this.user = data.session!.user;
				this.token = data.session?.refresh_token;
			} catch (error) {}
		},
	},
});
