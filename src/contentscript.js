import $ from 'jquery'
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

function handleFont($container) {
  const url = getRawUrl(location.href)
  const name = location.pathname.replace(/\//g, '-')
  const style = `<style>
    @font-face {
      font-family: "${name}";
      src: url(${url});
    }
  </style>`
  $(style).appendTo('head')

  // Alphabet taken from https://fonts.google.com/
  $(`<div style="font-family:'${name}';font-size:20px;padding:20px;">
    <div>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*</div>
    <textarea style="margin-top: 20px; width: 100%; padding: 6px; height: 120px;" placeholder="Type character here to preview"></textarea>
  </div>`).appendTo($container)
}

function handle(type, $container) {
  return function() {
    switch (type) {
      case 'video':
      case 'office':
        chrome.runtime.sendMessage({
          type,
          payload: location.href,
        })
        break
      case 'font':
      case 'image':
      case 'graphviz': {
        $(this).toggleClass('selected')
        const $children = $container.children(`:not(.BlobToolbar)`)
        if ($children.length === 1) {
          // First trigger
          if (type === 'font') {
            handleFont($container)
            $children.hide()
          } else if (type === 'image') {
            $(
              `<div class="image"><img src="${getRawUrl(
                location.href,
              )}" /></div>`,
            ).appendTo($container)
            $children.hide()
          } else if (type === 'graphviz') {
            chrome.runtime.sendMessage(
              {
                type,
                payload: $container.text(),
              },
              result => {
                $(`<div class="image"></div>`).html(result).appendTo($container)
                $children.hide()
              },
            )
          }
        } else {
          $children.toggle()
        }
      }
      default:
        break
    }
    return false
  }
}

function main() {
  const ext = path.extname(location.pathname).slice(1) // Remove '.'
  const type = getFileType(ext)
  if (!type) return

  const $container = $('.blob-wrapper')
  if ($container.length === 0) return

  const $button = $(
    '<a href="javascript:" class="btn btn-sm BtnGroup-item">View</a>',
  ).on('click', handle(type, $container))

  $('<div class="BtnGroup"></div>').append($button).prependTo('.file-actions')
}

gitHubInjection(window, main)
