<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { locales } from '@/localization/languages.ts';

import { Languages } from 'lucide-vue-next';

const { locale } = useI18n();

function changeLanguage(language: string) {
	const code = locales.find((locale) => locale.code === language)?.code!;

	locale.value = code;

	localStorage.setItem('language', code);
}
</script>

<template>
	<DropdownMenu @select="changeLanguage">
		<DropdownMenuTrigger>
			<Button size="icon">
				<div class="flex align-center gap-2">
					<Languages />
				</div>
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuItem
				v-for="(locale, index) in locales"
				class="cursor-pointer"
				:key="`${index}`"
				:text-value="locale.title"
				@select="changeLanguage(locale.code)"
			>
				{{ locale.title }}
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
