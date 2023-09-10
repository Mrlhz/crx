import { throttle } from 'lodash'
const imageReg = new RegExp('/media/(.*)\\?format=')

function init() {
  const elementToObserve = document.querySelector('div[aria-label="Home timeline"]')
  if (!elementToObserve) {
    window.setTimeout(init, 1000)
    return
  }

  // 创建一个叫 `observer` 的新 `MutationObserver` 实例，
  // 并将回调函数传给它
  const _mutationCallback = throttle(mutationCallback, 1000)
  const observer = new MutationObserver(_mutationCallback)

  // 在 MutationObserver 实例上调用 `observe` 方法，
  // 并将要观察的元素与选项传给此方法
  observer.observe(elementToObserve, {
    subtree: true,
    childList: true
  })
}

function mutationCallback() {
  getMediaList()
}

init()

function format(date = new Date()) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()

  const pad = arr => arr.map(t => String(t).padStart(2, '0'))

  return `${pad([year, month, day]).join('-')} ${pad([hours, minutes, seconds]).join('-')}`
}

async function getMediaList() {
  const result = [...document.querySelectorAll('div[data-testid="cellInnerDiv"]')].map(item => {
    const user = item.querySelector('div[dir="ltr"] span')
    // const userName = item.querySelector('a[role="link"] div[dir="auto"] span')
    const userName = [...item.querySelectorAll('div[data-testid="User-Name"] span')].map(v => v.innerText)

    const tweetText = item.querySelector('div[data-testid="tweetText"]')
    const time = item.querySelector('time')
    const datetime = time ? format(time.getAttribute('datetime')) : ''

    const _images = [...item.querySelectorAll('div[data-testid="tweetPhoto"] img')]
    const images = _images.length ? _images.map(item => item.getAttribute('src')) : []
    const gallery = getGallery(images, {
      datetime
    })
    const id = gallery.map(item => item.id).join('_$$_')

    return {
      id,
      userId: user ? user.innerText : '',
      name: userName.length ? `${userName[0]}${userName[3]}` : '',
      datetime,
      tweetText: tweetText ? tweetText.innerText : '',
      images: gallery
    }
  })

  console.log(result)

  await chrome.runtime.sendMessage({
    cmd: 'content_script_to_list_tab',
    url: location.href,
    result
  }, callback)

  function callback(response) {}
}

function setIamgeUrl(source) {
  const url = new URL(source)
  const {
    origin,
    pathname,
    search
  } = url
  const searchParams = new URLSearchParams(search)
  searchParams.set('name', 'large')

  return `${origin}${pathname}?${searchParams.toString()}`
}

function getGallery(gallery = [], options = {}) {
  return gallery.map(item => {
    const found = item.match(imageReg)
    return {
      id: found ? found[1] : '',
      source: item,
      url: setIamgeUrl(item),
      ...(options || {})
    }
  })
}
