import path from 'path-browserify'
import gitHubInjection from 'github-injection'
import { getRawUrl } from './utils'

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

function getFileType(ext) {
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
  button.innerHTML = 'Octoview'

  button.addEventListener('click', e => {
    switch (type) {
      case 'video':
      case 'office':
        chrome.runtime.sendMessage({ type, payload: location.href })
        break
      case 'font':
      case 'image':
      case 'graphviz': {
        ;(e.target as HTMLElement).classList.toggle('selected')

        const $children = container.querySelector(
          ':not(.BlobToolbar)',
        ) as HTMLElement

        if ($children) {
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
            div.style = `font-family:'${name}';font-size:20px;padding:20px;`
            div.innerHTML = `
<div>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*</div>
<textarea style="margin-top: 20px; width: 100%; padding: 6px; height: 120px;" placeholder="Type character here to preview"></textarea>`

            container.append(div)

            $children.style.display = 'none'
          } else if (type === 'image') {
            const div = document.createElement('div')
            div.className = 'image'
            div.innerHTML = `<img src="${getRawUrl(location.href)}" />`
            container.append(div)

            $children.style.display = 'none'
          } else if (type === 'graphviz') {
            chrome.runtime.sendMessage(
              { type, payload: container.textContent },
              result => {
                const div = document.createElement('div')
                div.className = 'image'
                div.innerHTML = result
                container.append(div)

                $children.style.display = 'none'
              },
            )
          }
        } else {
          $children.style.display =
            $children.style.display === 'none' ? 'block' : 'none'
        }
      }
      default:
        break
    }
    return false
  })

  container.parentNode.querySelector('.BtnGroup').prepend(button)
}

gitHubInjection(window, main)
