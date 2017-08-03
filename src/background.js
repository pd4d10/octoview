import viz from 'viz.js'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'dot':
      sendResponse(viz(message.content))
    default:
      return
  }
})
