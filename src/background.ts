import { getRawUrl, MessageType } from './utils'

function openNewWindow(url: string) {
  window.open(url, undefined, 'width=1000,height=700')
}

chrome.runtime.onMessage.addListener(
  async (message: MessageType, sender, sendResponse) => {
    switch (message.type) {
      case 'video':
      case 'font':
      case 'image':
      case 'graphviz': {
        const payload = encodeURIComponent(getRawUrl(message.payload))
        const url = chrome.runtime.getURL(
          `dist/preview.html?type=${message.type}&payload=${payload}`,
        )
        openNewWindow(url)
        break
      }
      case 'office': {
        const url = encodeURIComponent(getRawUrl(message.payload))
        openNewWindow(
          `https://view.officeapps.live.com/op/view.aspx?src=${url}`,
        )
        break
      }
    }
  },
)
