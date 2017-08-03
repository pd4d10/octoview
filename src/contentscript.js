import $ from 'jquery';
import gitHubInjection from 'github-injection';

gitHubInjection(() => {
  const $dom = $('.type-graphviz-dot');
  if ($dom) {
    $('<a class="btn btn-sm BtnGroup-item">Octoview</a>')
      .prependTo('.file-actions>.BtnGroup')
      .on('click', function() {
        const $children = $dom.children()

        if ($children.length === 1) {
          // First trigger
          chrome.runtime.sendMessage(
            {
              type: 'dot',
              content: $dom.text(),
            },
            result => {
              $children.hide()
              $dom.append($(result))
            }
          );
        } else {
          $children.toggle();
        }
      });
  }
});
