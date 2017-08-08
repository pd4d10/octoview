import $ from 'jquery'
import path from 'path-browserify'

$('body').css('margin', 0)

const params = new URLSearchParams(location.search)
const type = params.get('type')
const payload = decodeURIComponent(params.get('payload'))

switch (type) {
  case 'video': {
    // TODO: UE
    $('<video>')
      .attr({
        autoplay: true,
        controls: true,
        src: payload,
      })
      .css({
        maxWidth: '100%',
        maxHeight: '100%',
      })
      .appendTo('body')
  }
  // case 'html': {
  //   fetch(payload).then(res => res.text()).then(text => {
  //     const html = text.replace(
  //       /(href|src)=["|']?(.+?)["|']?(\s)/g,
  //       (match, property, href) => {
  //         if (/^https:?\/\//.test(href)) {
  //           return match
  //         }
  //         if (!/[.|\/]/.test(href)) {
  //           href = `./${href}`
  //           console.log(href)
  //         }
  //         const absoluteUrl = path
  //           .join(payload, href)
  //           .replace(/https:\//, 'https://')
  //           .replace('raw.githubusercontent.com', 'rawgit.com')
  //         return `${property}="${absoluteUrl}"`
  //       },
  //     )
  //     document.write(html)
  //   })
  // }
}
