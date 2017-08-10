import viz from 'viz.js'
// import plist from 'plist'
import { getRawUrl } from './utils'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'graphviz':
      sendResponse(viz(message.payload))
      break
    // case 'html':
    case 'video': {
      const payload = encodeURIComponent(getRawUrl(message.payload))
      const url = chrome.runtime.getURL(
        `dist/preview.html?type=${message.type}&payload=${payload}`,
      )
      window.open(url, undefined, 'width=800,height=600')
      break
    }
    case 'office': {
      const url = encodeURIComponent(getRawUrl(message.payload))
      const previewUrl = `https://view.officeapps.live.com/op/view.aspx?src=${url}`
      window.open(previewUrl, undefined, 'width=800,height=600')
      break
    }
    // case 'plist': {
    //   sendResponse(JSON.stringify(plist.parse(message.payload), null, 2))
    //   return
    // }
    default:
      break
  }
})
