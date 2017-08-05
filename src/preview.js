import $ from 'jquery'

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
}
