<script setup lang="ts">
import UserDetails from '@/components/account/UserDetails.vue';
import ChangePassword from '@/components/account/ChangePassword.vue';
</script>

<template>
	<section class="py-4 lg:pt-12">
		<div
			class="grid gap-6 items-start mb-6 pb-6 px-6 border-b md:mb-8 md:pb-8 md:px-8 lg:grid-cols-3 lg:mb-12 lg:pb-12 lg:px-12"
		>
			<UserDetails />
		</div>

		<div
			class="grid gap-6 items-start mb-6 pb-12 px-6 md:mb-8 md:pb-8 md:px-8 lg:grid-cols-3 lg:mb-12 lg:pb-12 lg:px-12"
		>
			<ChangePassword />
		</div>
	</section>
</template>
