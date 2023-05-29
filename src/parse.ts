import fs from 'fs-extra'
import { runAsWorker } from 'synckit'
import { parseSource } from 'vue-docgen-api'

runAsWorker(async (filePath: string, options: any) => {
  const file = fs.readFileSync(filePath, 'utf-8')
  const parsed = await parseSource(file, filePath, options)
  return parsed
})
