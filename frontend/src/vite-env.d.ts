/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_STELLAR_HORIZON_URL: string
    readonly VITE_STELLAR_NETWORK: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
} 