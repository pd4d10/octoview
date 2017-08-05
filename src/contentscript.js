import $ from 'jquery'
import path from 'path-browserify'
import gitHubInjection from 'github-injection'
import { getRawUrl } from './utils'

const exts = {
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
  html: ['htm', 'html'],
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
  $(`<div style="font-family:${name};font-size:20px;padding:20px;">
    <div>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*</div>
    <div contenteditable style="margin-top: 20px">Type here to preview specific character</div>
  </div>`)
    .appendTo($container)
    .children()
    .eq(1)
    .focus()
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

    if (exts.html.includes(ext)) {
      return
    }

    $(this).toggleClass('selected')
    const $children = $container.children()
    if ($children.length === 1) {
      // First trigger
      if (exts.font.includes(ext)) {
        handleFont($container)
        $children.hide()
      } else {
        getGraphvizData($container.text(), result => {
          $('<div class="image"></div>').html(result).appendTo($container)
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
