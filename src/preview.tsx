import React from 'react'
import ReactDOM from 'react-dom'

document.body.style.margin = '0'

const params = new URLSearchParams(location.search)
const type = params.get('type')
const payload = decodeURIComponent(params.get('payload') || '')
if (!type || !payload) {
  throw new Error('payload empty')
}

const FontView: React.SFC = () => {
  const fontName = 'OctoviewFont'

  React.useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
@font-face {
  font-family: "${fontName}";
  src: url(${payload});
}`
    document.head.appendChild(style)
  }, [])

  return (
    <div style={{ fontFamily: fontName, fontSize: 20, padding: 20 }}>
      <div>
        {/* Alphabet taken from https://fonts.google.com/ */}
        {
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*'
        }
      </div>
      <textarea
        style={{
          marginTop: 20,
          width: '100%',
          padding: 6,
          fontSize: 20,
          height: 120,
          fontFamily: fontName,
        }}
        placeholder="Type character here to preview"
      />
    </div>
  )
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
    case 'font':
      return <FontView />
    default:
      return null
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
