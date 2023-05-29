import type { EventDescriptor } from 'vue-docgen-api'

export function parseType(type: any) {
  return type?.name === 'union'
    ? '`enum`'
    : `\`${format(type?.name)}\``
}

export function parseTypeExpand(type: any) {
  return type?.name === 'union'
    ? `\`${type.elements?.map((v: any) => v.name).join(' 666 ')}\``
    : `\`${format(type?.name)}\``
}

export function parseEventType(eventType: EventDescriptor['type']) {
  return eventType?.names[0] === 'union'
    ? `\`(${eventType.elements?.map(v => v.name).join('666')}): void\``
    : '`(): void`'
}

export function format(type?: string) {
  if (!type)
    return '-'
  return `\`${type}\``
}
