import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';

// Use global i18n helper to translate outside of components
import { t as $t } from '@/plugins/i18n-helper';

import {
	signUp,
	getSession,
	logout,
	login,
	updateUser,
	getUser,
	changePassword,
	resetPassword,
	updateUserPassword,
} from '@/api/auth';

import type { User, SignupPayload, UserPayload } from '@/types/User.ts';

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
		async signUp(userData: SignupPayload): Promise<void> {
			try {
				const data = await signUp(userData);

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
			this.user = null;

			await logout();
		},

		async login(email: string, password: string): Promise<void> {
			try {
				const data = await login(email, password);
				const session = data.session ?? null;

				this.user = session?.user ?? null;
				this.token = session?.access_token ?? null;
			} catch (error: any) {
				const code: string | undefined = error?.code;

				// Try translate by code via auth namespace, then fallback to generic, then to message/key
				const message =
					(code && $t(`auth.${code}`)) ||
					$t('auth.generic_error') ||
					error?.message ||
					String(code) ||
					'';
				toast.error(message);
				throw error;
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

		async changePassword(password: string) {
			try {
				const data = await changePassword(password);

				this.user = data.user ?? null;
			} catch (error: any) {
				if (error.code !== 'same_password') {
					toast.error(error.message);
				}

				throw error;
			}
		},

		async resetPassword(email: string) {
			try {
				await resetPassword(email);
			} catch (error: any) {
				toast.error($t(error.code));

				throw error;
			}
		},

		async setNewPassword(password: string) {
			try {
				const data = await updateUserPassword({ password });

				this.user = data.user;
			} catch (error: any) {
				toast.error(error.message);
			}
		},
	},
});
