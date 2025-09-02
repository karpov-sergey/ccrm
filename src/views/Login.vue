<script setup lang="ts">
import { ref } from 'vue';

import { useForm, configure } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher.vue';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const onLoginSubmit = async () => {
	isLoading.value = true;

	try {
		await authStore.login(email.value, password.value);

		await router.push('/');
	} catch (error) {}
};
</script>

<template>
	<Card class="w-full md:w-[500px]">
		<CardHeader class="gap-4">
			<CardTitle class="flex items-center justify-between text-2xl">
				{{ t('login') }}
				<LanguageSwitcher />
			</CardTitle>
			<CardDescription>
				{{ t('enter_your_email_and_password') }}
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form class="grid gap-4" @submit.prevent="onLoginSubmit">
				<div class="grid gap-2">
					<Label for="email">{{ t('email') }}</Label>
					<Input
						v-model="email"
						id="email"
						type="email"
						placeholder="m@example.com"
						required
					/>
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">{{ t('password') }}</Label>
						<!--						<a href="#" class="ml-auto inline-block text-sm underline">-->
						<!--							Forgot your password?-->
						<!--						</a>-->
					</div>
					<Input v-model="password" id="password" type="password" required />
				</div>
				<Button type="submit" class="w-full" :loading="isLoading">
					{{ t('login') }}
				</Button>
				<!--				<Button variant="outline" class="w-full"> Login with Google </Button>-->
			</form>
			<div class="mt-4 text-end text-sm">
				{{ t('dont_have_account') }}
				<RouterLink class="underline" to="/signup">
					{{ t('sign_up') }}
				</RouterLink>
			</div>
		</CardContent>
	</Card>
</template>
