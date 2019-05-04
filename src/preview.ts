document.body.style.margin = '0'

const params = new URLSearchParams(location.search)
const type = params.get('type')
const payload = decodeURIComponent(params.get('payload'))

switch (type) {
  case 'video': {
    // TODO: UE
    const video = document.querySelector('video')
    video.autoplay = true
    video.controls = true
    video.src = payload
    video.style.maxWidth = '100%'
    video.style.maxHeight = '100%'

    document.body.appendChild(video)
  }
}
