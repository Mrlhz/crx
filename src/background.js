
const menu = {
  'id': 'downloadTab',
  'type': 'normal',
  'title': '打开下载页签'
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create(menu)
})

chrome.contextMenus.onClicked.addListener(async function(info, tab) {
  const {
    menuItemId
  } = info
  console.log(info, tab)

  if (menuItemId === menu.id) {
    createTab('./list.html')
  }
})

async function createTab(path) {
  const url = chrome.runtime.getURL(path)

  const tab = await chrome.tabs.create({ url })

  return tab
}
