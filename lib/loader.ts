type Ready = { __ready?: boolean };

/** Runs cb once the page loader has finished (immediately if it already has). Returns a cleanup. */
export function onReady(cb: () => void) {
  if ((window as unknown as Ready).__ready) {
    cb();
    return () => {};
  }
  window.addEventListener("site:ready", cb, { once: true });
  return () => window.removeEventListener("site:ready", cb);
}

export function markReady() {
  (window as unknown as Ready).__ready = true;
  window.dispatchEvent(new Event("site:ready"));
}
