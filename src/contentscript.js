import $ from 'jquery'
import path from 'path-browserify'
import gitHubInjection from 'github-injection'
import { getRawUrl } from './utils'

const CONTAINER_ID = 'octoview-container'

const exts = {
  image: ['bmp', 'webp', 'ico'],
  media: [
    'mp3',
    'mp4',
    'ogg',
    'webm',
    'mkv',
    'avi',
    'mov',
    'wmv',
    'wav',
    'rm',
    'rmvb',
    'aac',
  ],
  // html: ['htm', 'html'],
  font: ['ttf', 'ttc', 'woff', 'woff2'],
  graphviz: ['dot', 'gv'],
}

const allExts = Object.keys(exts).reduce(
  (result, key) => [...result, ...exts[key]],
  [],
)

function getGraphvizData(payload, cb) {
  chrome.runtime.sendMessage(
    {
      type: 'graphviz',
      payload,
    },
    cb,
  )
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
  $(`<div id="${CONTAINER_ID}" style="font-family:${name};font-size:20px;padding:20px;">
    <div>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*</div>
    <textarea style="margin-top: 20px; width: 100%;" placeholder="Type here to preview specific character"></textarea>
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

    // if (exts.html.includes(ext)) {
    //   chrome.runtime.sendMessage({
    //     type: 'html',
    //     payload: location.href,
    //   })
    //   return
    // }

    $(this).toggleClass('selected')
    const $children = $container.children(`table, #${CONTAINER_ID}`)
    if ($children.length === 1) {
      // First trigger
      if (exts.font.includes(ext)) {
        handleFont($container)
        $children.hide()
      } else if (exts.image.includes(ext)) {
        $(
          `<div id="${CONTAINER_ID}" class="image"><img src="${getRawUrl(
            location.href,
          )}" /></div>`,
        ).appendTo($container)
        $children.hide()
      } else if (exts.graphviz.includes(ext)) {
        getGraphvizData($container.text(), result => {
          $(`<div id="${CONTAINER_ID}" class="image"></div>`)
            .html(result)
            .appendTo($container)
          $children.hide()
        })
      }
    } else {
      $children.toggle()
    }
    return false
  }
}

function main() {
  const ext = path.extname(location.pathname).slice(1) // Remove '.'
  if (!allExts.includes(ext)) return

  const $container = $('.blob-wrapper')
  if ($container.length === 0) return

  const $button = $(
    '<a href="javascript:" class="btn btn-sm BtnGroup-item">Octoview</a>',
  ).on('click', handle(ext, $container))

  $('<div class="BtnGroup"></div>').append($button).prependTo('.file-actions')
}

gitHubInjection(window, main)
