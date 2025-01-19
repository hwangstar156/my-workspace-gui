import {
  ApiHandler,
  CacheHandler,
  IpcHandler,
  NpmrcHandler,
  NvmHandler,
  ProjectHandler,
  StoreHandler,
  TerminalHandler,
} from '../main/preload'

declare global {
  interface Window {
    npmrcAPI: NpmrcHandler
    api: ApiHandler
    nvmAPI: NvmHandler
    terminalAPI: TerminalHandler
    projectAPI: ProjectHandler
    storeAPI: StoreHandler
    cacheAPI: CacheHandler
  }
}
