document.body.style.margin = '0'

const params = new URLSearchParams(location.search)
const type = params.get('type')
const payload = params.get('payload')
if (!payload) {
  throw new Error('payload empty')
}

switch (type) {
  case 'video': {
    // TODO: UE
    const video = document.createElement('video')!
    video.autoplay = true
    video.controls = true
    video.src = decodeURIComponent(payload)
    video.style.maxWidth = '100%'
    video.style.maxHeight = '100%'

    document.body.appendChild(video)
  }
}
