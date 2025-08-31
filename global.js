
export async function outputJSON(...args) {
  const method = 'writeFile'
  const result = await fetch(`http://localhost:8080/fsPromises/${method}`, {
    method: 'post',
    // https://nodejs.org/docs/latest/api/fs.html#fspromiseswritefilefile-data-options
    // file, data, options
    body: JSON.stringify(args),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
    .then(res => res.json())
    .catch(error => {
      console.log(error)
    })

  return result
}

// Downloads Location
export const DOWNLOADSLOCATION = 'downloadsLocation'
export const DIR = `D:\\xx\\xx_data`
export async function pathExists(list = [], options = {}) {
  let { dir } = options
  if (!dir) {
    dir = DIR
  }

  list.forEach(item => {
    Reflect.set(item, DOWNLOADSLOCATION, dir)
  })

  const { result } = await fetch('http://localhost:8080/pathExists', {
    method: 'post',
    body: JSON.stringify(list),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .catch(error => {
      console.log(error)
      if (error instanceof TypeError) {
        console.log(error.message)
      }
      // notice({ message: 'pathExists服务未启用' })
      console.log('pathExists服务未启用：', error)
      return { result: [] }
    })

  if (!Array.isArray(result)) {
    return []
  }

  // chrome.downloads.download 接收自定义字段会报错
  result.forEach(item => {
    Reflect.deleteProperty(item, DOWNLOADSLOCATION)
  })

  return result
}

export async function exists(...args) {
  // fs.constants.R_OK 4
  const method = 'access'
  const result = await fetch(`http://localhost:8080/fsPromises/${method}`, {
    method: 'post',
    // https://nodejs.org/docs/latest/api/fs.html#fspromiseswritefilefile-data-options
    // file, data, options
    body: JSON.stringify(args),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
    .then(res => res.json())
    .catch(error => {
      console.log(error)
    })

  return result
}

// const contents = await readFile(filePath, { encoding: 'utf8' })
export async function readFile(...args) {
  const method = 'readFile'
  const result = await fetch(`http://localhost:8080/fsPromises/${method}`, {
    method: 'post',
    // https://nodejs.org/docs/latest/api/fs.html#fspromiseswritefilefile-data-options
    // file, data, options
    body: JSON.stringify(args),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
    .then(res => res.json())
    .catch(error => {
      console.log(error)
    })

  // {
  //   msg: "success",
  //   result: "{}"
  // }
  return result?.result
}
