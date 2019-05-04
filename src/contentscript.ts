import path from 'path-browserify'
import gitHubInjection from 'github-injection'
import { MessageType } from './utils'

const typeMap = {
  bmp: 'image',
  webp: 'image',
  ico: 'image',
  mp3: 'video',
  mp4: 'video',
  ogg: 'video',
  webm: 'video',
  mkv: 'video',
  avi: 'video',
  mov: 'video',
  wmv: 'video',
  wav: 'video',
  rm: 'video',
  rmvb: 'video',
  aac: 'video',
  otf: 'font',
  ttf: 'font',
  ttc: 'font',
  woff: 'font',
  woff2: 'font',
  dot: 'graphviz',
  gv: 'graphviz',
  doc: 'office',
  docx: 'office',
  ppt: 'office',
  pptx: 'office',
  xls: 'office',
  xlsx: 'office',
}

function getFileType(ext: string) {
  return typeMap[ext.toLowerCase()]
}

function main() {
  const ext = path.extname(location.pathname).slice(1) // Remove '.'
  const type = getFileType(ext)
  if (!type) return

  const container = document.querySelector('.blob-wrapper') as HTMLElement
  if (!container) return

  const button = document.createElement('a')
  button.href = 'javascript:'
  button.className = 'btn btn-sm BtnGroup-item'
  button.innerHTML = `
<svg width="16" height="16" class="octicon octicon-eye" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
Octoview`

  button.addEventListener('click', e => {
    e.preventDefault()
    switch (type) {
      case 'video':
      case 'office':
      case 'font':
      case 'image': {
        const message: MessageType = { type, payload: location.href }
        chrome.runtime.sendMessage(message)
        break
      }
      case 'graphviz': {
        const message: MessageType = {
          type,
          payload: container.innerText,
        }
        chrome.runtime.sendMessage(message)
        break
      }
    }
  })

  container.parentNode!.querySelector('.BtnGroup')!.prepend(button)
}

gitHubInjection(window, main)
