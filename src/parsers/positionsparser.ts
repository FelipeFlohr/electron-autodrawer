import {Positions} from "../types/positions";
import fs from "fs";

/**
 * Parser for the positions.
 * @author Felipe Matheus Flohr
 * @see defaultpositions.json
 */
export class PositionsParser {
    private readonly _path: string
    private readonly _positions: Positions

    /**
     * Constructor for the class
     * @param jsonPath The path to the JSON file containing the positions
     */
    constructor(jsonPath: string) {
        this._path = jsonPath;
        this._positions = this.getPositions()
    }

    /**
     * Getter for the positions
     * @returns Positions as a {@link Positions}
     */
    get positions(): Positions {
        return this._positions;
    }

    private getPositions(): Positions {
        const jsonString = fs.readFileSync(this._path).toString()
        return JSON.parse(jsonString)
    }
}
