/* eslint-disable @typescript-eslint/ban-ts-comment */
import { dirname, resolve } from 'node:path'
import type { MarkdownRenderer } from 'vitepress'
import type { parse as _parse } from 'vue-docgen-api'
import { TsRunner, createSyncFn } from 'synckit'
import { format, normalizePath, parseEventType, parseProps, parseType, parseTypeExpand } from './utils'

const parseFilePath = resolve(__dirname, './parse.mjs')
const parse = createSyncFn<typeof _parse>(parseFilePath, {
  tsRunner: TsRunner.TSX,
})

export interface MarkdownVueDocsOptions {
  popup?: (text: string, content: string) => string
  dir?: string
}

function popup(text: string, content: string) {
  if (text === content)
    return text
  content = content.replace(/"/g, '\'')
  content = content.replace(/`/g, '`')
  return `<div style="text-decoration: underline;cursor: pointer; padding: 0 2px;" title="${content}">${text}</div>`
}

function use(md: MarkdownRenderer, { dir, ...opts }: MarkdownVueDocsOptions = {}) {
  function addRenderRule(type: string) {
    const defaultRender = md.renderer.rules[type]
    md.renderer.rules[type] = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const content = token.content.trim()
      if (!content.match(/^<vue-docgen\s/))
        return defaultRender!(tokens, idx, options, env, self)

      let path = env.path
      const props = parseProps(content)

      if (!props.src) {
        console.error(`rendering ${path}: src prop is required`)
        return defaultRender!(tokens, idx, options, env, self)
      }

      if (props.src.includes('~/') && dir)
        path = dir

      const { src, title } = props
      const dirPath = dirname(path)
      const srcPath = normalizePath(resolve(dirPath, src))
      const parsed = parse(srcPath)

      let text = ''

      function incTitle(key: string) {
        text += `## ${title ? `${title} ` : ''}${key}\n\n`
      }
      function incTableHead(...heads: string[]) {
        text += `| ${heads.join(' | ')} |\n`
        text += `| ${heads.map(() => '---').join(' | ')} |\n`
      }
      function incTableBody(...bodies: string[]) {
        text += `| ${bodies.join(' | ')} |\n`
      }
      function incTableEnd() {
        text += '\n'
      }

      if (parsed.props) {
        incTitle('Props')
        incTableHead('Name', 'Description', 'Type', 'Default')
        for (const prop of parsed.props) {
          const type = (opts.popup || popup)(parseType(prop.type), parseTypeExpand(prop.type))
          incTableBody(prop.name, prop.description || '-', type, format(prop.defaultValue?.value))
        }
        incTableEnd()
      }
      if (parsed.events) {
        incTitle('Events')
        incTableHead('Name', 'Description', 'Type')
        for (const event of parsed.events)
          incTableBody(event.name, event.description || '-', parseEventType(event.type))
        incTableEnd()
      }
      if (parsed.slots) {
        incTitle('Slots')
        incTableHead('Name', 'Description')
        for (const slot of parsed.slots)
          incTableBody(slot.name, slot.description || '-')
        incTableEnd()
      }
      if (parsed.expose) {
        incTitle('Exposes')
        incTableHead('Name', 'Description', 'Type')
        for (const expose of parsed.expose) {
          // @ts-expect-error
          const type = expose.tags?.find(v => v.title === 'type')?.type
          incTableBody(expose.name, expose.description || '-', parseTypeExpand(type))
        }
        incTableEnd()
      }

      return md.render(text.replace(/ #/g, '777'))
        .replace(/666/g, '|')
        .replace(/777/g, '#')
    }
  }
  addRenderRule('html_block')
  addRenderRule('html_inline')
}

export default use
