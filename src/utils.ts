export function getRawUrl(url: string) {
  return url
    .replace('github.com', 'raw.githubusercontent.com')
    .replace('/blob/', '/')
}

export type MessageType =
  | { type: 'video'; payload: string }
  | { type: 'office'; payload: string }
  | { type: 'font'; payload: string }
  | { type: 'image'; payload: string }
  | { type: 'graphviz'; payload: string }
