const env = 'production';

const urlConfig = {
    production: {
        api: process.env.REACT_APP_API_URL,
        socket: process.env.REACT_APP_SOCKET_URL
    },
    development: {
        api: process.env.REACT_APP_API_URL_DEV,
        socket: process.env.REACT_APP_SOCKET_URL_DEV
    },
}[env];

export { urlConfig };
