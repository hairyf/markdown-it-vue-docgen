import type { MarkdownEnv } from 'vitepress'

let isLoad = false

export function initialization(env: MarkdownEnv) {
  if (isLoad)
    return
  isLoad = true
  if (!env.sfcBlocks?.scripts)
    env.sfcBlocks!.scripts = []
  const tags = env.sfcBlocks!.scripts
  tags.unshift({
    content: `
    <script setup>
      import Popper from "vue3-popper";
    </script>
    <style>
    .vp-doc table { overflow-y: hidden; }
    :root {
      --popper-theme-background-color: #ffffff;
      --popper-theme-background-color-hover: #ffffff;
      --popper-theme-text-color: #333333;
      --popper-theme-border-width: 1px;
      --popper-theme-border-style: solid;
      --popper-theme-border-color: #eeeeee;
      --popper-theme-border-radius: 6px;
      --popper-theme-padding: 12px;
      --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
    }
    .dark {
      --popper-theme-background-color: #333333;
      --popper-theme-background-color-hover: #333333;
      --popper-theme-text-color: white;
      --popper-theme-border-width: 0px;
      --popper-theme-border-radius: 6px;
      --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
    }
    .v-gen-popper {
      text-decoration: underline;
      cursor: pointer;
      padding: 0 2px;
    }
    </style>
    `.trim(),
  } as any)
}
