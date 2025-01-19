import { promises as fs } from 'fs'
import crypto from 'crypto'
import { detect } from 'detect-package-manager'

type CacheEntry = {
  data: any
  lockHash: string
}

const cache = new Map<string, CacheEntry>()

async function generateFileHash(filePath: string): Promise<string> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return crypto.createHash('sha256').update(fileContent).digest('hex')
  } catch (error) {
    throw error
  }
}

export async function getCachedData(projectPath: string): Promise<any> {
  const packageManager = await detect({ cwd: projectPath })
  const lockFilePath = `${projectPath}/${PACKAGE_LOCK_MAP[packageManager]}`
  const currentHash = await generateFileHash(lockFilePath)
  const cachedEntry = cache.get(projectPath)

  console.log({ currentHash, cachedEntry })

  if (cachedEntry && cachedEntry.lockHash === currentHash) {
    return { data: cachedEntry.data, currentHash }
  }

  return { data: null, currentHash }
}

export async function setCachedData(projectPath: string, data: any, currentHash: string) {
  cache.set(projectPath, { data, lockHash: currentHash })
}

const PACKAGE_LOCK_MAP = {
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
  pnpm: 'pnpm-lock.yaml',
}
