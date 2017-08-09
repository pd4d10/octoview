import viz from 'viz.js'
import plist from 'plist'
import { getRawUrl } from './utils'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'graphviz':
      sendResponse(viz(message.payload))
      return
    // case 'html':
    case 'video': {
      const payload = encodeURIComponent(getRawUrl(message.payload))
      const url = chrome.runtime.getURL(
        `dist/preview.html?type=${message.type}&payload=${payload}`,
      )
      window.open(url, undefined, 'width=800,height=600')
    }
    case 'plist': {
      sendResponse(JSON.stringify(plist.parse(message.payload), null, 2))
      return
    }
    default:
      return
  }
})
