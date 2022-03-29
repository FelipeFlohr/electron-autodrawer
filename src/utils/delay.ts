/**
 * Method similar to Java's *Thread.sleep*.
 * @param ms Time to *sleep* in milliseconds
 */
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}