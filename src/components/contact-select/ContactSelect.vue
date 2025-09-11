<script setup lang="ts">
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
</script>

<template>
	<Select>
		<SelectTrigger class="w-[280px]">
			<SelectValue placeholder="Select a timezone" />
		</SelectTrigger>
		<SelectContent>
			<SelectGroup>
				<SelectLabel>North America</SelectLabel>
				<SelectItem value="est"> Eastern Standard Time (EST) </SelectItem>
				<SelectItem value="cst"> Central Standard Time (CST) </SelectItem>
				<SelectItem value="mst"> Mountain Standard Time (MST) </SelectItem>
				<SelectItem value="pst"> Pacific Standard Time (PST) </SelectItem>
				<SelectItem value="akst"> Alaska Standard Time (AKST) </SelectItem>
				<SelectItem value="hst"> Hawaii Standard Time (HST) </SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>
</template>
