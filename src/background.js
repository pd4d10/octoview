import viz from 'viz.js'
import plist from 'plist'
import xlsx from 'xlsx'
import { getRawUrl } from './utils'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'graphviz':
      return sendResponse(viz(message.payload))
    // case 'html':
    case 'video': {
      const payload = encodeURIComponent(getRawUrl(message.payload))
      const url = chrome.runtime.getURL(
        `dist/preview.html?type=${message.type}&payload=${payload}`,
      )
      window.open(url, undefined, 'width=800,height=600')
    }
    case 'xlsx': {
      fetch(getRawUrl(message.payload))
        .then(res => res.arrayBuffer())
        .then(buffer => {
          let str = ''
          new Uint8Array(buffer).forEach(c => {
            str += String.fromCharCode(c)
          })
          const workbook = xlsx.read(str, { type: 'binary' })
          // const html = workbook.SheetNames.reduce((str, name) => {
          // return (
          //   str +
          //   xlsx.write(workbook, {
          //     sheet: name,
          //     type: 'binary',
          //     bookType: 'html',
          //   })
          // )
          // }, ''
          const result = workbook.SheetNames.reduce(
            (arr, name) => [
              ...arr,
              {
                name,
                data: xlsx.utils.sheet_to_json(workbook.Sheets[name]),
              },
            ],
            [],
          )
          sendResponse(result)
        })
        .catch(err => {
          sendResponse(err.message)
        })
      return true
    }
    // case 'plist': {
    //   sendResponse(JSON.stringify(plist.parse(message.payload), null, 2))
    //   return
    // }
    default:
      return
  }
})
