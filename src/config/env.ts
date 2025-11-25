export const ENV = import.meta.env.VITE_ENV;
export const API_URL = import.meta.env.VITE_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

console.log(`🚀 ${ENV}:`, API_URL);
