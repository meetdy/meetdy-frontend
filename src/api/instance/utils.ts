export const logResponseDuration = (url: string, duration: number): void => {
    const color =
        duration < 500
            ? "\x1b[32m" // Green
            : duration < 1000
              ? "\x1b[33m" // Yellow
              : "\x1b[31m"; // Red

    console.log(`[${url}]: ${color}${duration} ms\x1b[0m`);
};

export const colorMethodHttp = (data: string): string => {
    const method = data.toUpperCase();
    const colorMap: Record<string, string> = {
        GET: "\x1b[36m", // Blue
        POST: "\x1b[32m", // Green
        PUT: "\x1b[33m", // Yellow
        DELETE: "\x1b[31m", // Red
    };
    const colorMethod = colorMap[method] || "\x1b[37m"; // Default to White

    return colorMethod + method + "\x1b[0m";
};
