export const formatDateSeparator = (
    timestamp: number | string,
    timezone = 0,
): string => {
    const date =
        typeof timestamp === "string"
            ? new Date(timestamp)
            : new Date((timestamp + timezone) * 1000);

    return date.toLocaleDateString("uk-UA", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        ...(typeof timestamp === "number" && { timeZone: "UTC" }),
    });
};

export const formatTimeSeparator = (timestamp: number | string, timezone: number = 0): string => {
    const date =
        typeof timestamp === "string"
            ? new Date(timestamp)
            : new Date((timestamp + timezone) * 1000);

    return date.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
        ...(typeof timestamp === "number" && { timeZone: "UTC" }),
    });
};

