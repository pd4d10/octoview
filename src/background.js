import viz from 'viz.js'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'htm':
    case 'html':
      return
    case 'dot':
      sendResponse(viz(message.content))
      return
    case 'psd':
    case 'bin':
    default:
      return
  }
})
