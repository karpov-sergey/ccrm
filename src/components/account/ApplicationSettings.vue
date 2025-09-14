<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/ui/button';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import SelectCustom from '@/components/ui/select-custom/SelectCustom.vue';

import { currencies } from '@/constants/common.ts';
import { locales } from '@/localization/languages.ts';

import type { UserPayload } from '@/types/User.ts';

const authStore = useAuthStore();
const { user } = storeToRefs(useAuthStore());
const { t } = useI18n();

const formSchema = toTypedSchema(
	z.object({
		currency: z.enum(currencies.map((c) => c.code) as [string, ...string[]]),
		language: z.enum(Object.keys(locales) as [string, ...string[]]),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		currency: user.value?.user_metadata?.currency ?? 'USD',
		language: user.value?.user_metadata?.language ?? 'en',
	},
});

const isSaving = ref(false);

watch(
	user,
	(value) => {
		if (!value) return;
		form.resetForm({
			values: {
				currency: value.user_metadata?.currency ?? 'USD',
				language: value.user_metadata?.language ?? 'en',
			},
		});
	},
	{ immediate: true }
);

const currencyOptions = computed(() => {
	return currencies.map((currency) => ({
		value: currency.code,
		label: `${currency.code} — ${currency.name} (${currency.symbol})`,
	}));
});

const languageOptions = computed(() =>
	Object.entries(locales).map(([code, name]) => ({ value: code, label: name }))
);

const onSubmit = form.handleSubmit(async (values: UserPayload) => {
	isSaving.value = true;
	try {
		await authStore.updateUser(values);
	} catch (error) {
	} finally {
		isSaving.value = false;
	}
});
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="text-lg font-bold">
			{{ t('application_settings') }}
		</div>
		<div class="text-sidebar-foreground/70 text-sm font-medium">
			{{ t('set_application_settings_according_to_your_preferences') }}
		</div>
	</div>
	<form class="grid gap-6 col-span-2 lg:max-w-[600px]" @submit="onSubmit">
		<div class="grid items-start gap-6 content-start lg:grid-cols-2">
			<FormField v-slot="{ componentField }" name="language">
				<FormItem>
					<FormLabel>
						{{ t('language') }}
					</FormLabel>
					<FormControl>
						<SelectCustom
							type="text"
							v-bind="componentField"
							:options="languageOptions"
							trigger-class="w-full"
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>

			<FormField v-slot="{ componentField }" name="currency">
				<FormItem>
					<FormLabel>
						{{ t('default_currency') }}
					</FormLabel>
					<FormControl>
						<SelectCustom
							type="text"
							v-bind="componentField"
							:options="currencyOptions"
							trigger-class="w-full"
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
		</div>

		<Button
			class="w-full md:w-auto justify-self-start"
			type="submit"
			:loading="isSaving"
			:disabled="isSaving || !form.meta.value.dirty || !form.meta.value.valid"
		>
			{{ t('save') }}
		</Button>
	</form>
</template>
