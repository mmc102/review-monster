import React from 'react'

interface PDFViewerProps {
  url: string
  height: number
  width: number
}


const PDFViewer: React.FC<PDFViewerProps> = ({ url, width, height }) => {
  return (
    <div>
        <embed src={url} type="application/pdf"   height={`${height}px`} width={`${width}px`}></embed>
    </div>
  )
}

export default PDFViewer