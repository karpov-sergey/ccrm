<script setup lang="ts">
import { Separator } from '@/components/ui/separator';
import Board from '@/components/board/Board.vue';
</script>

<template>
	<section class="p-6">
		<p>This is the Board page.</p>
		<Separator class="mb-4" />
		<Board />
	</section>
</template>
