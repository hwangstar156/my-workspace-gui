import { ApiHandler, IpcHandler, NpmrcHandler } from '../main/preload'

declare global {
  interface Window {
    npmrcAPI: NpmrcHandler
    api: ApiHandler
  }
}
