import React from 'react'
import ReactDOM from 'react-dom'

document.body.style.margin = '0'

const params = new URLSearchParams(location.search)
const type = params.get('type')
const payload = decodeURIComponent(params.get('payload') || '')
if (!type || !payload) {
  throw new Error('payload empty')
}

const App: React.SFC = () => {
  switch (type) {
    case 'video':
      return (
        <video
          autoPlay
          controls
          src={payload}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      )
    default:
      return null
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
