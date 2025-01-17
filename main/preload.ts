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

contextBridge.exposeInMainWorld('npmrcAPI', npmrcHandler)

contextBridge.exposeInMainWorld('api', apiHandler)

contextBridge.exposeInMainWorld('nvmAPI', nvmHandler)

contextBridge.exposeInMainWorld('terminalAPI', terminalHandler)

export type NpmrcHandler = typeof npmrcHandler
export type ApiHandler = typeof apiHandler
export type NvmHandler = typeof nvmHandler
export type TerminalHandler = typeof terminalHandler
