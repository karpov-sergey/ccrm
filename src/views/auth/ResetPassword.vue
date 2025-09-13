<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
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

import { Eye, EyeClosed, AlertTriangle } from 'lucide-vue-next';

const authStore = useAuthStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const isPasswordVisible = ref(false);
const isResetTokenExpired = ref(false);

const formSchema = toTypedSchema(
	z.object({
		password: z.string().min(6).max(50),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		password: '',
	},
});

onBeforeMount(async () => {
	checkTokenExpired();
});

const checkTokenExpired = () => {
	const hash = route.hash;

	if (hash) {
		const params = new URLSearchParams(hash.slice(1));

		const errorDescription = params.get('error_description');

		if (!!errorDescription) {
			isResetTokenExpired.value = true;
		}
	}
};

const onSetPasswordVisibilityClick = () => {
	isPasswordVisible.value = !isPasswordVisible.value;
};

const onSubmit = form.handleSubmit(async (values) => {
	isLoading.value = true;

	try {
		await authStore.changePassword(values.password);

		await router.push('/');
	} catch (error: any) {
		const code: string | undefined = error?.code;

		form.setFieldTouched('password', true);

		if (code === 'same_password') {
			form.setFieldError(
				'password',
				t('validation.new_password_should_be_different_from_old')
			);
		}
	} finally {
		isLoading.value = false;
	}
});
</script>

<template>
	<Card
		class="grid grid-rows-[auto_1fr_auto] w-full h-dvh rounded-none border-0 shadow-none md:h-auto md:w-[500px] md:rounded-xl md:border md:shadow-md"
	>
		<CardHeader class="block">
			<CardTitle class="flex items-center justify-between text-2xl mb-2">
				{{ t('set_new_password') }}
				<LanguageSwitcher />
			</CardTitle>
			<CardDescription v-if="!isResetTokenExpired">
				{{ t('enter_your_new_password') }}
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				v-if="!isResetTokenExpired"
				id="reset-password-form"
				@submit="onSubmit"
			>
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
								<Eye v-if="!isPasswordVisible" />
								<EyeClosed v-if="isPasswordVisible" />
							</Button>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
			</form>
			<div v-else class="flex flex-col items-center justify-center gap-4">
				<AlertTriangle class="w-10 h-10 text-primary" />
				<div class="text-muted-foreground text-center">
					{{ t('reset_password_token_expired') }}
				</div>
			</div>
		</CardContent>
		<CardFooter class="flex flex-col">
			<Button
				v-if="!isResetTokenExpired"
				type="submit"
				form="reset-password-form"
				class="w-full mb-6"
				:loading="isLoading"
				:disabled="isLoading || !form.meta.value.valid"
			>
				{{ t('set_new_password') }}
			</Button>
			<div class="w-full text-sm text-right">
				<RouterLink class="underline" to="/login">
					{{ t('go_to_login') }}
				</RouterLink>
			</div>
		</CardFooter>
	</Card>
</template>
