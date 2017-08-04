import viz from 'viz.js';
import { getRawUrl } from './utils';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'htm':
    case 'html':
      return;
    case 'graphviz':
      sendResponse(viz(message.payload));
      return;
    case 'video': {
      const payload = encodeURIComponent(getRawUrl(message.payload));
      const url = chrome.runtime.getURL(
        `dist/preview.html?type=video&payload=${payload}`
      );
      window.open(url, undefined, 'width=800,height=600');
    }
    default:
      return;
  }
});
