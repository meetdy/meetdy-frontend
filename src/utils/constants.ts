const env = 'production';

const urlConfig = {
  production: {
    api: process.env.REACT_APP_API_URL,
    socket: import.meta.env.VITE_SOCKET_URL,
  },
  development: {
    api: process.env.REACT_APP_API_URL_DEV,
    socket: import.meta.env.VITE_SOCKET_URL_DEV,
  },
}[env];

export { urlConfig };
