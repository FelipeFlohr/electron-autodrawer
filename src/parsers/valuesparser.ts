import { Values } from "../types/values";
import fs from "fs";

/**
 * Parser for the values
 */
export class ValuesParser {
    private readonly _path: string
    private readonly _values: Values

    /**
     * Constructor for the class
     * @param jsonPath The path to the JSON containing the values
     */
    constructor(jsonPath: string) {
        this._path = jsonPath;
        this._values = this.getValues()
    }

    /**
     * Getter for the values
     * @returns The values as a {@link Values} type
     */
    get values() {
        return this._values
    }

    private getValues(): Values {
        const jsonString = fs.readFileSync(this._path).toString()
        return JSON.parse(jsonString)
    }
}
