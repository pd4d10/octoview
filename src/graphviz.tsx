import React from 'react'
import viz from 'viz.js'

export const GraphvizView: React.SFC<{ code: string }> = ({ code }) => {
  return <div dangerouslySetInnerHTML={{ __html: viz(code) }} />
}
