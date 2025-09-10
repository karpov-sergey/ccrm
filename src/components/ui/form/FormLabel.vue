<script lang="ts" setup>
import type { LabelProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { Label } from '@/components/ui/label'
import { useFormField } from "./useFormField"

const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>()

import { computed, toValue } from "vue"
const { error, formItemId, isTouched } = useFormField()
const shouldShow = computed(() => toValue(isTouched))
</script>

<template>
  <Label
    data-slot="form-label"
    :data-error="!!error && shouldShow"
    :class="cn(
      'data-[error=true]:text-destructive-foreground',
      props.class,
    )"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
