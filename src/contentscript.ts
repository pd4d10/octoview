import path from 'path-browserify'
import gitHubInjection from 'github-injection'
import { getRawUrl, MessageType } from './utils'

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
    switch (type) {
      case 'video':
      case 'office': {
        const message: MessageType = { type, payload: location.href }
        chrome.runtime.sendMessage(message)
        break
      }
      case 'font':
      case 'image':
      case 'graphviz': {
        ;(e.target as HTMLElement).classList.toggle('selected')

        const $children = container.querySelector(':not(.BlobToolbar)')
        if (!$children) break

        const $c = $children as HTMLElement

        // First trigger
        if (type === 'font') {
          const url = getRawUrl(location.href)
          const name = location.pathname.replace(/\//g, '-')

          const style = document.createElement('style')
          style.innerHTML = `
@font-face {
  font-family: "${name}";
  src: url(${url});
}`
          document.head.appendChild(style)

          // Alphabet taken from https://fonts.google.com/
          const div = document.createElement('div')
          div.style.fontFamily = name
          div.style.fontSize = '20px'
          div.style.padding = '20px'
          div.innerHTML = `
<div>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*</div>
<textarea style="margin-top: 20px; width: 100%; padding: 6px; height: 120px;" placeholder="Type character here to preview"></textarea>`

          container.append(div)

          $c.style.display = 'none'
        } else if (type === 'image') {
          const div = document.createElement('div')
          div.className = 'image'
          div.innerHTML = `<img src="${getRawUrl(location.href)}" />`
          container.append(div)

          $children.style.display = 'none'
        } else if (type === 'graphviz') {
          const message: MessageType = {
            type,
            payload: container.innerText,
          }
          chrome.runtime.sendMessage(message, result => {
            const div = document.createElement('div')
            div.className = 'image'
            div.innerHTML = result
            container.append(div)

            $c.style.display = 'none'
          })
        }
      }
      default:
        break
    }
    return false
  })

  container.parentNode!.querySelector('.BtnGroup')!.prepend(button)
}

gitHubInjection(window, main)
