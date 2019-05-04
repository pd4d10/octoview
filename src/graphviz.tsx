import React from 'react'

export const GraphvizView: React.SFC<{ code: string }> = ({ code }) => {
  const [svgHtml, setSvgHtml] = React.useState('')
  React.useEffect(() => {
    ;(async () => {
      const { default: viz } = await import('viz.js')
      setSvgHtml(viz(code))
    })()
  })

  return <div dangerouslySetInnerHTML={{ __html: svgHtml }} />
}
