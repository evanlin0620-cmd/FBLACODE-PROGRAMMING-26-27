declare global {
  interface Window {
    api: {
      call: (name: string, input?: unknown) => Promise<unknown>
    }
  }
}

export {}
