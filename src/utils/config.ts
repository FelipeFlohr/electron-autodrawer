import fs from "fs"

/**
 * Reads the "*config.json*" file, parse it and returns as a type
 * @returns *config.json* as a **config** type
 */
export function getConfig(): config {
    const jsonString = fs.readFileSync("../config.json").toString()

    return JSON.parse(jsonString)
}

/**
 * Represents the "*config.json*" type
 */
type config = {
    "useDefaultPositions": boolean,
    "useDefaultValues": boolean,
    "delayFactor": number,
    "imageLocation": string,
    "positionsLocation": string,
    "valuesLocation": string
}