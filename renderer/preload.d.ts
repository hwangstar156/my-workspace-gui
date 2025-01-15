import { ApiHandler, IpcHandler, NpmrcHandler, NvmHandler, TerminalHandler } from '../main/preload'

declare global {
  interface Window {
    npmrcAPI: NpmrcHandler
    api: ApiHandler
    nvmAPI: NvmHandler
    terminalAPI: TerminalHandler
  }
}
