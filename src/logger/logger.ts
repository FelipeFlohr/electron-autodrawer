/**
 * Will log a message to the console
 * @param level Level of the message
 * @param msg Message to be logged
 * @see {@link LogLevel}
 */
export function log(level: LogLevel, msg: string) {
    const date = new Date()
    console.log(`[${level}] ${msg} - ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
}

/**
 * The level of the log
 */
export enum LogLevel {
    OK = "OK",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    FATAL = "FATAL"
}
