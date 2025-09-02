<script setup lang="ts">
import { ref } from 'vue';

import { useForm } from 'vee-validate';
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
import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher.vue';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Eye, EyeClosed } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const isLoading = ref(false);
const isPasswordVisible = ref(false);

const formSchema = toTypedSchema(
	z.object({
		email: z.string().email(),
		password: z.string(z.any()),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		email: '',
		password: '',
	},
});

const onSetPasswordVisibilityClick = () => {
	isPasswordVisible.value = !isPasswordVisible.value;
};

const onSubmit = form.handleSubmit(async (values) => {
	isLoading.value = true;

	try {
		await authStore.login(values.email, values.password);

		await router.push('/');
	} catch (error: any) {
		const code: string | undefined = error?.code;

		// Mark fields as touched so FormMessage becomes visible immediately
		form.setFieldTouched('password', true);

		if (
			code === 'invalid_credentials' ||
			code === 'invalid_login_credentials'
		) {
			form.setFieldError('password', t('auth.invalid_credentials'));
		} else if (code === 'user_not_found') {
			form.setFieldError('email', t('auth.user_not_found'));
		} else if (code === 'wrong_password') {
			form.setFieldError('password', t('auth.wrong_password'));
		} else {
			const message = error?.message ?? t('auth.generic_error');

			form.setFieldError('password', message);
		}
	} finally {
		isLoading.value = false;
	}
});
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
			<form class="grid gap-4 mb-6" @submit="onSubmit">
				<FormField v-slot="{ componentField }" name="email">
					<FormItem>
						<FormLabel>{{ t('email') }}</FormLabel>
						<FormControl>
							<Input
								type="text"
								v-bind="componentField"
								placeholder="m@example.com"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="password">
					<FormItem class="relative mb-6">
						<FormLabel>{{ t('password') }}</FormLabel>
						<FormControl>
							<Input
								class="pr-10"
								:type="isPasswordVisible ? 'text' : 'password'"
								v-bind="componentField"
							/>
							<Button
								class="absolute end-0 inset-y-5.5 hover:bg-transparent"
								size="icon"
								variant="ghost"
								type="button"
								:aria-label="
									isPasswordVisible ? t('hide_password') : t('show_password')
								"
								@click="onSetPasswordVisibilityClick"
							>
								<Eye class="z-50" v-if="!isPasswordVisible" />
								<EyeClosed class="z-50" v-if="isPasswordVisible" />
							</Button>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<Button
					type="submit"
					class="w-full"
					:loading="isLoading"
					:disabled="isLoading || !form.meta.value.valid"
				>
					{{ t('login') }}
				</Button>
			</form>
			<div class="mt-4 text-end text-sm">
				{{ t('dont_have_account') }}
				<RouterLink class="underline" to="/signup">
					{{ t('signup') }}
				</RouterLink>
			</div>
		</CardContent>
	</Card>
</template>
