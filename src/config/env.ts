const ENV = import.meta.env.VITE_ENV;
const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

console.log('🚀 env:', import.meta.env);
console.log(`🚀 ${ENV}:`, API_URL);

export { ENV, API_URL, SOCKET_URL };
