<template>
  <div id="list-home">
    <div class="btns">
      <el-button @click="clearSelection()">清除选择</el-button>
      <el-button @click="toggleSelection()">反选</el-button>
      <el-button @click="download">下载</el-button>
    </div>
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="Date" width="160">
        <template #default="scope">{{ scope.row.datetime }}</template>
      </el-table-column>
      <el-table-column property="tweetText" label="Title" show-overflow-tooltip />
      <el-table-column property="address" label="Image" width="100">
        <template #default="{ row }">{{ row.images.length }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { ref, toValue } from 'vue'
import { sleep, safeFileName } from './utils.js'

export default {
  name: 'ListHome',
  setup() {
    const tableData = ref([])
    const multipleTableRef = ref(null)
    const multipleSelection = ref([])
    const toggleSelection = () => {
      const selectionRows = multipleTableRef.value.getSelectionRows()
      const ids = selectionRows.map(({ id }) => id)

      const unSelectRows = tableData.value.filter(row => !ids.includes(row.id))

      unSelectRows.forEach((row) => {
        multipleTableRef.value.toggleRowSelection(row, true)
      })

      selectionRows.forEach((row) => {
        multipleTableRef.value.toggleRowSelection(row, false)
      })
    }
    const clearSelection = () => {
      multipleTableRef.value.clearSelection()
    }
    const handleSelectionChange = (val) => {
      multipleSelection.value = val
    }
    const gallery = new Map()

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      console.log('消息：', request, sender, sendResponse)
      const { cmd, result } = request
      if (cmd === 'content_script_to_list_tab') {
        setData(result)
        console.log({ result }, gallery)
      }
      sendResponse({ message: '我是 list，已收到你的消息：', request })
      return true
    })

    function setData(data = []) {
      const filterData = data.filter(item => item.id && item.images.length)

      filterData.forEach(item => {
        const { id } = item
        if (!gallery.has(id)) {
          gallery.set(id, item)
          tableData.value.push(item)
        }
      })
    }

    async function download() {
      const selection = multipleTableRef.value.getSelectionRows()
      console.log({ selection }, multipleSelection.value, toValue(multipleSelection.value))
      downloadJSONFile(toValue(multipleSelection.value))
      downloadImageBatch(toValue(multipleSelection.value))
    }

    function downloadJSONFile(result = []) {
      const text = JSON.stringify(result, null, 2)
      const blob = new Blob([text], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const { name } = toValue(result[0]) || {}
      const filename = `${name}/${name}_${Date.now()}.json`
      return chrome.downloads.download({ url, filename }).then(downloadId => {
        return { downloadId }
      })
    }

    async function downloadImageBatch(list = []) {
      console.log({ list }, list.length)
      if (!Array.isArray(list)) {
        console.log('fail: ', list)
        return
      }

      while (list.length) {
        const item = list.pop()
        const { name, tweetText, datetime, images } = toValue(item) || {}
        const tasks = images.map((image, i) => {
          const { id, url } = image
          // 有换行符无法下载
          const title = (tweetText || '').replace(/\n/g, '-')

          const filename = `${name}/${datetime}_${safeFileName(title || id)}-${i + 1}.jpg`
          return chrome.downloads.download({ url, filename }).then(downloadId => {
            return { downloadId }
          })
        })
        await Promise.allSettled(tasks)
        await sleep(2000)
      }
      console.log('end')
    }

    return {
      tableData,
      multipleTableRef,
      multipleSelection,
      toggleSelection,
      clearSelection,
      handleSelectionChange,
      download
    }
  }
}
</script>

<style lang="scss">
#list-home {
  padding: 10px 20px;
  .btns {
    margin-top: 20px;
    margin-bottom: 10px;
  }
}
</style>
