import $ from 'jquery';
import path from 'path-browserify';
import gitHubInjection from 'github-injection';

// Handle these file types
const fileTypes = ['htm', 'html', 'dot', 'ttf', 'ttc', 'woff', 'woff2'];

function getFontType(ext) {
  const obj = {
    ttc: 'truetype',
    ttf: 'truetype',
    woff: 'woff',
    woff2: 'woff2',
  };
  return obj[ext];
}

function handler(ext, $container) {
  return () => {
    switch (ext) {
      case 'dot': {
        const $children = $container.children();

        if ($children.length === 1) {
          // First trigger
          chrome.runtime.sendMessage(
            {
              type: ext,
              content: $container.text(),
            },
            result => {
              $children.hide();
              $(result).appendTo($container);
            }
          );
        } else {
          $children.toggle();
        }
        break;
      }
      case 'ttf':
      case 'ttc':
      case 'woff':
      case 'woff2': {
        const url = $container.find('.image>a').attr('href');
        const name = path.basename(location.pathname).split('.')[0];
        const style = `<style>
          @font-face {
            font-family: "${name}";
            src: url(${url});
          }
        </style>`;
        $(style).appendTo('head');

        const $children = $container.children();
        if ($children.length === 1) {
          // First trigger
          $children.hide();
          // Alphabet taken from https://fonts.google.com/
          $(`<div style="font-family:${name};font-size:20px;padding:20px;">
            <div>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*</div>
            <div contenteditable style="margin-top: 20px">Type here to preview specific character</div>
          </div>`)
            .appendTo($container)
            .children()
            .eq(1)
            .focus();
        } else {
          $children.toggle();
        }
        break;
      }
      default:
        throw new Error('Should not be here');
    }
  };
}

function main() {
  const ext = path.extname(location.pathname).slice(1); // Remove '.'
  if (!fileTypes.includes(ext)) return;

  const $container = $('.blob-wrapper');
  if ($container.length === 0) return;

  $('<a class="btn btn-sm BtnGroup-item">Octoview</a>')
    .prependTo('.file-actions>.BtnGroup')
    .on('click', handler(ext, $container));
}

gitHubInjection(main);
