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

import type { Languages as LanguagesTypes } from '@/types/Languages.ts';

const { locale } = useI18n();

function changeLanguage(language: string) {
	locale.value = Object.keys(locales).find((k) => locales[k] === language)!;
}
</script>

<template>
	<DropdownMenu @select="changeLanguage">
		<DropdownMenuTrigger>
			<Button>
				<div class="flex align-center gap-2">
					<Languages />
				</div>
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuItem
				v-for="(locale, index) in locales"
				:key="`${locale}_${index}`"
				:text-value="locale"
				@select="changeLanguage(locale as LanguagesTypes)"
				>{{ locale }}
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
