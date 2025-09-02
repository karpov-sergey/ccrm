<script lang="ts" setup>
import { Slot } from "reka-ui"
import { computed, toValue } from "vue"
import { useFormField } from "./useFormField"

const { error, formItemId, formDescriptionId, formMessageId, isTouched } = useFormField()

// Only mark invalid after blur (touched)
const shouldShow = computed(() => toValue(isTouched))
</script>

<template>
  <Slot
    :id="formItemId"
    data-slot="form-control"
    :aria-describedby="!error || !shouldShow ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`"
    :aria-invalid="!!error && shouldShow"
  >
    <slot />
  </Slot>
</template>
