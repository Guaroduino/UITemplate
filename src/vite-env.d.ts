/// <reference types="vite/client" />

declare module 'replicad-opencascadejs/wasm?url' {
  const src: string;
  export default src;
}

declare module 'replicad-opencascadejs' {
  const init: (options?: Record<string, unknown>) => Promise<any>;
  export default init;
}
