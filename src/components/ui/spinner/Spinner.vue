<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

import type { HTMLAttributes } from 'vue';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<Loader2
		:class="cn('my-28 h-16 w-16 text-primary/60 animate-spin', props.class)"
	/>
</template>
