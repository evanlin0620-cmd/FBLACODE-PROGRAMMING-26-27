/**
 * The preload script is the bridge between the UI and the main process.
 * It exposes exactly one function, window.api.call(name, input). The UI gets
 * no direct access to Node, the file system, or Electron's own IPC.
 */
import { contextBridge, ipcRenderer } from 'electron'

const api = {
  call: (name: string, input?: unknown): Promise<unknown> => ipcRenderer.invoke('api', name, input)
}

contextBridge.exposeInMainWorld('api', api)

export type PreloadApi = typeof api
