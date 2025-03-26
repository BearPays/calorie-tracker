// Set this to true to enable debug logging
const DEBUG_ENABLED = true

export function debug(...args: any[]) {
  if (DEBUG_ENABLED) {
    console.log("[DEBUG]", ...args)
  }
}

