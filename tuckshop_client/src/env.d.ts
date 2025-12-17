// src/env.d.ts
interface ImportMetaEnv {
  readonly REACT_APP_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
