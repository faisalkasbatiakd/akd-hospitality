import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

/**
 * Rewritten from the generated version, which set state synchronously inside an
 * effect to read the initial width. matchMedia is an external store, so
 * useSyncExternalStore is the right tool: it reads the current value during
 * render, subscribes without a cascading re-render, and gives the server a
 * defined answer.
 */
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches

/**
 * Desktop on the server. The sidebar renders its expanded form first and the
 * client corrects on hydration, which is the safer default: a mobile user sees
 * a drawer appear, rather than a desktop user losing their navigation.
 */
const getServerSnapshot = () => false

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
