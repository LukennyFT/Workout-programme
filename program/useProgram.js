// React binding for the shared store. Uses the React global loaded by index.html.

/** @param {ReturnType<typeof import('./store.js').createStore>} store */
export function useProgram(store) {
  // @ts-ignore React is a UMD global
  return window.React.useSyncExternalStore(store.subscribe, store.getState, store.getState);
}
