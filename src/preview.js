import $ from 'jquery';

$('body').css('margin', 0)

const params = new URLSearchParams(location.search);
const type = params.get('type');
const payload = decodeURIComponent(params.get('payload'));

switch (type) {
  case 'video': {
    $('<video>')
      .attr({
        autoplay: true,
        controls: true,
        src: payload,
      })
      .appendTo('body');
  }
}
