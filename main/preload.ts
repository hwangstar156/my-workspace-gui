import { contextBridge, ipcRenderer } from 'electron'

const npmrcHandler = {
  readNpmrc: (targetPath: string) => ipcRenderer.invoke('read-npmrc', targetPath),
  writeNpmrc: (targetPath: string, content: string) =>
    ipcRenderer.invoke('write-npmrc', targetPath, content),
}

const apiHandler = {
  getHomeDir: async () => ipcRenderer.invoke('get-home-dir'),
}

const nvmHandler = {
  command: async (command: string) => ipcRenderer.invoke('nvm-command', command),
  setNodeVersion: async (version: string, isInstalled: boolean) =>
    ipcRenderer.invoke('nvm-set-version', version, isInstalled),
  getCurrentVersion: async () => ipcRenderer.invoke('get-current-node-version'),
  getCache: async (key: string) => ipcRenderer.invoke('get-cache', key),
  setCache: async (key: string, value: any) => ipcRenderer.invoke('set-cache', key, value),
  clearCache: async () => ipcRenderer.invoke('clear-cache'),
}

const terminalHandler = {
  openTerminal: async (command: string) => ipcRenderer.invoke('open-terminal', command),
}

const projectHandler = {
  getProject: async () => ipcRenderer.invoke('selectProjectPath'),
  getDependencies: async (projectPath: string) =>
    ipcRenderer.invoke('get-dependencies', projectPath),
  getPackageInfo: async (packageName: string) =>
    ipcRenderer.invoke('get-package-info', packageName),
  linkToDocs: async (projectName: string) => ipcRenderer.invoke('link-to-docs', projectName),
}

const storeHandler = {
  get: async (key: string) => ipcRenderer.invoke('store-get', key),
  set: async (key: string, value: any) => ipcRenderer.invoke('store-set', key, value),
  delete: async (key: string) => ipcRenderer.invoke('store-delete', key),
}

const cacheHandler = {
  getDependencies: async (filePath: string) =>
    ipcRenderer.invoke('get-dependencies-cache', filePath),
  setDependencies: async (filePath: string, data: any, currentHash: string) =>
    ipcRenderer.invoke('set-dependencies-cache', filePath, data, currentHash),
}

contextBridge.exposeInMainWorld('npmrcAPI', npmrcHandler)

contextBridge.exposeInMainWorld('api', apiHandler)

contextBridge.exposeInMainWorld('nvmAPI', nvmHandler)

contextBridge.exposeInMainWorld('terminalAPI', terminalHandler)

contextBridge.exposeInMainWorld('projectAPI', projectHandler)

contextBridge.exposeInMainWorld('storeAPI', storeHandler)

contextBridge.exposeInMainWorld('cacheAPI', cacheHandler)

export type NpmrcHandler = typeof npmrcHandler
export type ApiHandler = typeof apiHandler
export type NvmHandler = typeof nvmHandler
export type TerminalHandler = typeof terminalHandler
export type ProjectHandler = typeof projectHandler
export type StoreHandler = typeof storeHandler
export type CacheHandler = typeof cacheHandler
