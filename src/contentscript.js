import $ from 'jquery';
import path from 'path-browserify';
import gitHubInjection from 'github-injection';
import { getRawUrl } from './utils';

const mediaExts = [
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
];
const htmlExts = ['htm', 'html'];
const fontExts = ['ttf', 'ttc', 'woff', 'woff2'];
const graphvizExts = ['dot'];
const allExts = [...mediaExts, ...fontExts, ...htmlExts, ...graphvizExts];

function handleDot(ext, $container) {
  chrome.runtime.sendMessage(
    {
      type: ext,
      payload: $container.text(),
    },
    result => {
      $(result).appendTo($container);
    }
  );
}

function handleFont(ext, $container) {
  const url = getRawUrl(location.href);
  const name = path.basename(location.pathname).split('.')[0];
  const style = `<style>
    @font-face {
      font-family: "${name}";
      src: url(${url});
    }
  </style>`;
  $(style).appendTo('head');

  // Alphabet taken from https://fonts.google.com/
  $(`<div style="font-family:${name};font-size:20px;padding:20px;">
    <div>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*</div>
    <div contenteditable style="margin-top: 20px">Type here to preview specific character</div>
  </div>`)
    .appendTo($container)
    .children()
    .eq(1)
    .focus();
}

function handle(ext, $container) {
  return () => {
    // For media
    if (mediaExts.includes(ext)) {
      chrome.runtime.sendMessage({
        type: 'video',
        payload: location.href,
      });
      return;
    }

    if (htmlExts.includes(ext)) {
      return;
    }

    const $children = $container.children();
    if ($children.length === 1) {
      // First trigger
      // TODO: Hide when layer is ready
      $children.hide();
      if (fontExts.includes(ext)) {
        handleFont(ext, $container);
      } else {
        handleDot(ext, $container);
      }
    } else {
      $children.toggle();
    }
  };
}

function main() {
  const ext = path.extname(location.pathname).slice(1); // Remove '.'
  if (!allExts.includes(ext)) return;

  const $container = $('.blob-wrapper');
  if ($container.length === 0) return;

  // TODO: Button selected
  $('<a class="btn btn-sm BtnGroup-item">Octoview</a>')
    .prependTo('.file-actions>.BtnGroup')
    .on('click', handle(ext, $container));
}

gitHubInjection(main);
