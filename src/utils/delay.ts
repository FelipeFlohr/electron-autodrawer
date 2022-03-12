import { getConfig } from "./config";

/**
 * Method similar to Java's *Thread.sleep* but in a less resource expensive way. Brings the Event Loop to a halt.
 * @param ms Time to *sleep* in milliseconds
 */
export function sleep(ms: number) {
    const time = ms * getConfig().delayFactor
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, time)
}
