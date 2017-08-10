import $ from 'jquery' // TODO: Dynamic load
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

// const allExts = Object.keys(exts).reduce(
//   (result, key) => [...result, ...exts[key]],
//   [],
// )

// const typeMap = Object.keys(exts).reduce(
//   (r1, type) => ({
//     ...r1,
//     ...exts[type].reduce(
//       (r2, ext) => ({
//         ...r2,
//         [ext]: type,
//       }),
//       {},
//     ),
//   }),
//   {},
// )

function getFileType(ext) {
  return typeMap[ext.toLowerCase()]
}

function handleFont($container) {
  const url = getRawUrl(location.href)
  const name = path.basename(location.pathname).split('.')[0]
  const style = `<style>
    @font-face {
      font-family: "${name}";
      src: url(${url});
    }
  </style>`
  $(style).appendTo('head')

  // Alphabet taken from https://fonts.google.com/
  $(`<div style="font-family:${name};font-size:20px;padding:20px;">
    <div>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*</div>
    <textarea style="margin-top: 20px; width: 100%; padding: 6px; height: 120px;" placeholder="Type character here to preview"></textarea>
  </div>`).appendTo($container)
}

function handle(ext, $container) {
  return function() {
    // For media
    if (exts.media.includes(ext)) {
      chrome.runtime.sendMessage({
        type: 'video',
        payload: location.href,
      })
      return
    }

    if (exts.office.includes(ext)) {
      chrome.runtime.sendMessage({
        type: 'office',
        payload: location.href,
      })
      return
    }

    // if (exts.html.includes(ext)) {
    //   chrome.runtime.sendMessage({
    //     type: 'html',
    //     payload: location.href,
    //   })
    //   return
    // }

    $(this).toggleClass('selected')
    const $children = $container.children(`:not(.BlobToolbar)`)
    if ($children.length === 1) {
      // First trigger
      if (exts.font.includes(ext)) {
        handleFont($container)
        $children.hide()
      } else if (exts.image.includes(ext)) {
        $(
          `<div class="image"><img src="${getRawUrl(location.href)}" /></div>`,
        ).appendTo($container)
        $children.hide()
      } else if (exts.graphviz.includes(ext)) {
        chrome.runtime.sendMessage(
          {
            type: 'graphviz',
            payload: $container.text(),
          },
          result => {
            $(`<div class="image"></div>`).html(result).appendTo($container)
            $children.hide()
          },
        )
        // } else if (exts.plist.includes(ext)) {
        //   chrome.runtime.sendMessage(
        //     {
        //       type: 'plist',
        //       payload: $container.text(),
        //     },
        //     result => {
        //       $(`<pre>`).html(result).appendTo($container)
        //       $children.hide()
        //     },
        //   )
      }
    } else {
      $children.toggle()
    }
    return false
  }
}

function main() {
  const ext = path.extname(location.pathname).slice(1) // Remove '.'
  if (!getFileType(ext)) return

  const $container = $('.blob-wrapper')
  if ($container.length === 0) return

  const $button = $(
    '<a href="javascript:" class="btn btn-sm BtnGroup-item">Octoview</a>',
  ).on('click', handle(ext, $container))

  $('<div class="BtnGroup"></div>').append($button).prependTo('.file-actions')
}

gitHubInjection(window, main)
