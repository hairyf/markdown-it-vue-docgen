<script lang="ts" setup>
import { defineExpose, ref } from 'vue'

withDefaults(
  defineProps<{
    title: string
    /**
   * 这是一个`可选`值
   */
    type?: 'text' | 'number' | 'digit' | 'password' | 'textarea'
  }>(),
  {
    type: 'text',
  },
)

const emit = defineEmits<{
  /**
   * 这是一个 `click` 事件
   */
  (type: 'click', event: string | number): void
}>()

const value = ref('')

defineExpose({
  /**
   * 这是我暴露`出去`的组件属性
   * @type {string|number}
   */
  a: value,
})
</script>

<template>
  <!-- @slot 这是一个默认插槽 -->
  <slot />

  <!-- @slot 这是一个有`名字`的插槽 -->
  <slot name="body" />
</template>
