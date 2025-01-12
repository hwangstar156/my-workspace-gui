import { contextBridge, ipcRenderer } from 'electron'

const npmrcHandler = {
  readNpmrc: (targetPath: string) => ipcRenderer.invoke('read-npmrc', targetPath),
  writeNpmrc: (targetPath: string, content: string) =>
    ipcRenderer.invoke('write-npmrc', targetPath, content),
}

const apiHandler = {
  getHomeDir: async () => ipcRenderer.invoke('get-home-dir'),
}

contextBridge.exposeInMainWorld('npmrcAPI', npmrcHandler)

contextBridge.exposeInMainWorld('api', apiHandler)

export type NpmrcHandler = typeof npmrcHandler
export type ApiHandler = typeof apiHandler
