<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
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
import { useAuthStore } from '@/stores/auth.ts';
import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher.vue';

const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();

const email = ref('');
const password = ref('');

const isLoading = ref(false);

const isSignUpValid = computed(() => {
	return true;
	// return email.value.length > 3 && password.value.length >= 6;
});

const onCreateAccountSubmit = async () => {
	isLoading.value = true;

	try {
		await authStore.signUp(email.value, password.value);
		await router.push('/');
	} catch (error) {
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<Card class="w-[350px]">
		<CardHeader class="gap-4">
			<CardTitle class="flex items-center justify-between text-2xl">
				{{ t('sign_up') }}
				<LanguageSwitcher />
			</CardTitle>
			<CardDescription>
				{{ t('enter_your_information_to_create_account') }}
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form class="grid gap-4" @submit.prevent="onCreateAccountSubmit">
				<div class="grid gap-2">
					<Label for="email">
						{{ t('email') }}
					</Label>
					<Input
						v-model="email"
						id="email"
						type="email"
						placeholder="m@example.com"
						required
					/>
				</div>
				<div class="grid gap-2">
					<Label for="password">
						{{ t('password') }}
					</Label>
					<Input v-model="password" id="password" type="password" />
				</div>
				<Button
					type="submit"
					class="w-full"
					:loading="isLoading"
					:disabled="!isSignUpValid"
				>
					{{ t('create_an_account') }}
				</Button>
				<!--				<Button variant="outline" class="w-full"> Sign up with GitHub </Button>-->
			</form>
			<div class="mt-4 text-end text-sm">
				{{ t('already_have_an_account') }}
				<RouterLink class="underline" to="/login">
					{{ t('login') }}
				</RouterLink>
			</div>
		</CardContent>
	</Card>
</template>
