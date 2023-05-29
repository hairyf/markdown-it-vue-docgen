<script lang="ts" setup>
import { defineExpose, ref } from 'vue'

withDefaults(
  defineProps<{
    title: string
    /**
   * This is an `optional` value
   */
    type?: 'text' | 'number' | 'digit' | 'password' | 'textarea'
  }>(),
  {
    type: 'text',
  },
)

const emit = defineEmits<{
  /**
   * This is a `click` event
   */
  (type: 'click', event: string | number): void
}>()

const value = ref('')

defineExpose({
  /**
   * This is the component property that I `expose`
   * @type {string|number}
   */
  a: value,
})
</script>

<template>
  <!-- @slot This is a default slot -->
  <slot />

  <!-- @slot This is a slot with a `name` -->
  <slot name="body" />
</template>
